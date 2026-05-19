import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.store.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.store.findUnique({
      where: { id },
      include: {
        users: { include: { user: true } },
        categories: true,
        products: { take: 10 },
      },
    });
  }

  async create(data: { name: string; slug: string; address?: string; phone?: string; email?: string }) {
    return this.prisma.store.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.store.update({ where: { id }, data });
  }

  async getStats(id: string) {
    const [productCount, salesToday, lowStockCount] = await Promise.all([
      this.prisma.product.count({ where: { storeId: id } }),
      this.prisma.sale.count({
        where: {
          storeId: id,
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      this.prisma.inventory.count({
        where: {
          storeId: id,
          quantity: { lt: 10 },
        },
      }),
    ]);

    return { productCount, salesToday, lowStockCount };
  }
}