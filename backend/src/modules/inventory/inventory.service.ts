import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(storeId: string | undefined, filters?: { search?: string; lowStock?: boolean }) {
    if (!storeId) return [];
    const where: any = { storeId };
    
    if (filters?.search) {
      where.product = {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { sku: { contains: filters.search, mode: 'insensitive' } },
          { barcode: { contains: filters.search, mode: 'insensitive' } },
        ],
      };
    }

    return this.prisma.inventory.findMany({
      where,
      include: { product: { include: { category: true } } },
      orderBy: { product: { name: 'asc' } },
    });
  }

  async findOne(storeId: string, productId: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { storeId_productId: { storeId, productId } },
      include: { product: true, logs: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });
    if (!inventory) throw new NotFoundException('Inventory not found');
    return inventory;
  }

  async adjustStock(
    storeId: string,
    productId: string,
    userId: string,
    data: { type: string; quantity: number; reason?: string; notes?: string },
  ) {
    const inventory = await this.prisma.inventory.upsert({
      where: { storeId_productId: { storeId, productId } },
      create: { storeId, productId, quantity: 0 },
      update: {},
    });

    const newQty = data.type === 'add'
      ? inventory.quantity + data.quantity
      : Math.max(0, inventory.quantity - data.quantity);

    const [updated] = await this.prisma.$transaction([
      this.prisma.inventory.update({
        where: { id: inventory.id },
        data: { quantity: newQty, lastRestockedAt: data.type === 'add' ? new Date() : undefined },
      }),
      this.prisma.inventoryLog.create({
        data: {
          inventoryId: inventory.id,
          productId,
          storeId,
          userId,
          type: data.type,
          quantity: data.quantity,
          reason: data.reason,
          notes: data.notes,
        },
      }),
    ]);

    return updated;
  }

  async getLowStock(storeId: string) {
    const products = await this.prisma.product.findMany({
      where: { storeId, isActive: true },
      include: { inventory: { where: { storeId } } },
    });

    return products.filter(p => p.inventory.length > 0 && p.inventory[0].quantity <= p.lowStockAlert);
  }

  async getInventoryLogs(storeId: string, productId?: string, limit = 50) {
    return this.prisma.inventoryLog.findMany({
      where: { storeId, ...(productId ? { productId } : {}) },
      include: { inventory: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getStockSummary(storeId: string | undefined) {
    if (!storeId) {
      return { total_products: 0, total_quantity: 0, low_stock_count: 0 };
    }
    const inventory = await this.prisma.inventory.findMany({
      where: { storeId },
      include: { product: true },
    });

    const totalProducts = inventory.length;
    const totalQuantity = inventory.reduce((sum, i) => sum + i.quantity, 0);
    const lowStockCount = inventory.filter(i => i.quantity <= (i.product.lowStockAlert || 10)).length;

    return { total_products: totalProducts, total_quantity: totalQuantity, low_stock_count: lowStockCount };
  }
}