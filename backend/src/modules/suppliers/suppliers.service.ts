import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async findAll(storeId: string, search?: string) {
    const where: any = { storeId, isActive: true };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.supplier.findMany({ where, orderBy: { name: 'asc' } });
  }

  async findOne(storeId: string, id: string) {
    const supplier = await this.prisma.supplier.findFirst({
      where: { id, storeId },
      include: { products: { include: { product: true } }, purchaseOrders: { take: 10, orderBy: { createdAt: 'desc' } } },
    });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  async create(storeId: string, data: any) {
    return this.prisma.supplier.create({
      data: { ...data, storeId },
    });
  }

  async update(storeId: string, id: string, data: any) {
    const supplier = await this.prisma.supplier.findFirst({ where: { id, storeId } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return this.prisma.supplier.update({ where: { id }, data });
  }

  async delete(storeId: string, id: string) {
    const supplier = await this.prisma.supplier.findFirst({ where: { id, storeId } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return this.prisma.supplier.update({ where: { id }, data: { isActive: false } });
  }

  async createPurchaseOrder(storeId: string, userId: string, data: any) {
    const supplier = await this.prisma.supplier.findFirst({ where: { id: data.supplierId, storeId } });
    if (!supplier) throw new NotFoundException('Supplier not found');

    let totalAmount = 0;
    for (const item of data.items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
      item.totalAmount = item.quantity * item.unitPrice;
      totalAmount += item.totalAmount;
    }

    const orderNumber = `PO-${Date.now().toString(36).toUpperCase()}`;

    return this.prisma.purchaseOrder.create({
      data: {
        storeId,
        supplierId: data.supplierId,
        userId,
        orderNumber,
        status: data.status || 'draft',
        expectedDate: data.expectedDate,
        itemsTotal: totalAmount,
        totalAmount,
        notes: data.notes,
        items: { create: data.items },
      },
      include: { items: { include: { product: true } }, supplier: true },
    });
  }

  async findPurchaseOrders(storeId: string, supplierId?: string, status?: string) {
    const where: any = { storeId };
    if (supplierId) where.supplierId = supplierId;
    if (status) where.status = status;

    return this.prisma.purchaseOrder.findMany({
      where,
      include: { supplier: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async receivePurchaseOrder(storeId: string, orderId: string, data: { receivedItems: Array<{ itemId: string; quantity: number }> }) {
    const order = await this.prisma.purchaseOrder.findFirst({ where: { id: orderId, storeId } });
    if (!order) throw new NotFoundException('Purchase order not found');

    return this.prisma.$transaction(async (tx) => {
      for (const received of data.receivedItems) {
        const item = await tx.purchaseOrderItem.findUnique({ where: { id: received.itemId } });
        if (item) {
          await tx.purchaseOrderItem.update({
            where: { id: received.itemId },
            data: { receivedQty: item.receivedQty + received.quantity },
          });

          const inventory = await tx.inventory.findUnique({
            where: { storeId_productId: { storeId, productId: item.productId } },
          });

          if (inventory) {
            await tx.inventory.update({
              where: { id: inventory.id },
              data: { quantity: { increment: received.quantity }, lastRestockedAt: new Date() },
            });
          } else {
            await tx.inventory.create({
              data: { storeId, productId: item.productId, quantity: received.quantity, lastRestockedAt: new Date() },
            });
          }
        }
      }

      return tx.purchaseOrder.update({
        where: { id: orderId },
        data: { status: 'received', receivedDate: new Date() },
      });
    });
  }
}