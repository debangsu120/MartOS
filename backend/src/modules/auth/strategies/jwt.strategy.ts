import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'martos-secret-key',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { roles: { include: { role: true } }, stores: true },
    });

    if (!user || !user.isActive) {
      return null;
    }

    const defaultStore = user.stores.find(s => s.isDefault) || user.stores[0];

    return {
      userId: user.id,
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.roles[0]?.role?.name || 'cashier',
      stores: [{ storeId: payload.storeId || defaultStore?.storeId, isDefault: true }],
    };
  }
}