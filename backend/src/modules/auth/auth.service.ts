import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../config/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
      include: { role: true },
    });

    const userRoleId = userRoles[0]?.roleId;
    const payload = { sub: user.id, email: user.email, role: userRoleId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Audit log for login
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'Session',
        entityId: user.id,
        metadata: {
          email: user.email,
          timestamp: new Date().toISOString(),
          userAgent: 'dashboard',
        },
      },
    });

    // Get user stores
    const userStores = await this.prisma.userStore.findMany({
      where: { userId: user.id },
      include: { store: true },
    });

    const defaultStore = userStores.find(s => s.isDefault) || userStores[0];
    const storeId = defaultStore?.storeId;

    // Include storeId in JWT payload
    const payloadWithStore = { sub: user.id, email: user.email, role: userRoleId, storeId };
    const accessTokenWithStore = this.jwtService.sign(payloadWithStore);
    
    // Update session with new token
    await this.prisma.session.updateMany({
      where: { token: accessToken },
      data: { token: accessTokenWithStore },
    });

    return {
      accessToken: accessTokenWithStore,
      refreshToken,
      expiresIn: 3600,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: userRoles[0]?.role?.name || 'cashier',
        stores: userStores.map(us => us.storeId),
      },
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        phone: dto.phone,
      },
    });

    // Assign default role (cashier)
    const defaultRole = await this.prisma.role.findFirst({
      where: { name: 'cashier' },
    });

    if (defaultRole) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: defaultRole.id,
        },
      });
    }

    // Audit log for registration
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        entity: 'User',
        entityId: user.id,
        metadata: {
          email: dto.email,
          timestamp: new Date().toISOString(),
        },
      },
    });

    return { message: 'User registered successfully', userId: user.id };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET || 'martos-secret-key',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const userRoles = await this.prisma.userRole.findMany({
        where: { userId: payload.sub },
        include: { role: true },
      });
      const userRoleId = userRoles[0]?.roleId;
      const newPayload = { sub: user.id, email: user.email, role: userRoleId };
      const accessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

      return { accessToken, refreshToken: newRefreshToken, expiresIn: 3600 };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, token: string) {
    await this.prisma.session.deleteMany({
      where: { userId, token },
    });
    
    // Audit log for logout
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'LOGOUT',
        entity: 'Session',
        entityId: userId,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
    });
    
    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } },
        stores: { include: { store: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }
}