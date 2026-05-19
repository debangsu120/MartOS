import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(storeId?: string) {
    const where = storeId ? { stores: { some: { storeId } } } : {};
    return this.prisma.user.findMany({
      where,
      include: {
        roles: { include: { role: true } },
        stores: { include: { store: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: { include: { role: true } },
        stores: { include: { store: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: { email: string; password: string; name: string; phone?: string; storeId?: string; roleId?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
      },
    });

    if (data.storeId) {
      await this.prisma.userStore.create({
        data: { userId: user.id, storeId: data.storeId, isDefault: true },
      });
    }

    if (data.roleId) {
      await this.prisma.userRole.create({
        data: { userId: user.id, roleId: data.roleId },
      });
    }

    return user;
  }

  async update(id: string, data: { name?: string; phone?: string; isActive?: boolean }) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: { roles: { include: { role: true } } },
    });
  }

  async delete(id: string) {
    await this.prisma.user.update({ where: { id }, data: { isActive: false } });
    return { message: 'User deactivated' };
  }

  async getRoles() {
    return this.prisma.role.findMany();
  }
}