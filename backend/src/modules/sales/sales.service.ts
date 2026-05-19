import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  async createSale(
    storeId: string,
    userId: string,
    data: {
      items: Array<{ productId: string; quantity: number; discountPercent?: number }>;
      customerId?: string;
      paymentMethod: string;
      discountAmount?: number;
      discountPercent?: number;
      notes?: string;
    },
  ) {
    let subtotal = 0;
    const saleItems: any[] = [];

    for (const item of data.items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

      const inventory = await this.prisma.inventory.findUnique({
        where: { storeId_productId: { storeId, productId: item.productId } },
      });

      if (!inventory || inventory.quantity < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }

      const unitPrice = Number(product.sellingPrice);
      const discountAmount = item.discountPercent ? (unitPrice * item.discountPercent) / 100 : 0;
      const taxableAmount = unitPrice - discountAmount;
      const taxAmount = (taxableAmount * Number(product.gstRate)) / 100;
      const totalAmount = taxableAmount + taxAmount;

      saleItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        costPrice: Number(product.costPrice),
        discountPercent: item.discountPercent || 0,
        discountAmount,
        taxPercent: Number(product.gstRate),
        taxAmount,
        totalAmount,
      });

      subtotal += unitPrice * item.quantity;
    }

    const discountAmt = data.discountAmount || (data.discountPercent ? (subtotal * data.discountPercent) / 100 : 0);
    const afterDiscount = subtotal - discountAmt;
    const totalTax = saleItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalAmount = afterDiscount + totalTax;

    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          storeId,
          userId,
          customerId: data.customerId,
          orderNumber: this.generateOrderNumber(),
          subtotal,
          discountAmount: discountAmt,
          discountPercent: data.discountPercent,
          taxAmount: totalTax,
          totalAmount,
          paymentMethod: data.paymentMethod,
          notes: data.notes,
          completedAt: new Date(),
          items: {
            create: saleItems,
          },
        },
        include: { items: { include: { product: true } }, user: true, customer: true },
      });

      for (const item of data.items) {
        await tx.inventory.update({
          where: { storeId_productId: { storeId, productId: item.productId } },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return sale;
    });
  }

  async findAll(storeId: string, filters?: { startDate?: Date; endDate?: Date; status?: string }) {
    const where: any = { storeId };
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }
    if (filters?.status) where.status = filters.status;

    return this.prisma.sale.findMany({
      where,
      include: { items: { include: { product: true } }, user: true, customer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(storeId: string, saleId: string) {
    const sale = await this.prisma.sale.findFirst({
      where: { id: saleId, storeId },
      include: { items: { include: { product: true } }, user: true, customer: true },
    });
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  async voidSale(storeId: string, saleId: string, userId: string, reason: string) {
    const sale = await this.prisma.sale.findFirst({ where: { id: saleId, storeId }, include: { items: true } });
    if (!sale) throw new NotFoundException('Sale not found');
    if (sale.status === 'voided') throw new BadRequestException('Sale already voided');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.sale.update({
        where: { id: saleId },
        data: { status: 'voided', notes: `${sale.notes || ''}\n[Voided: ${reason}]` },
      });

      for (const item of sale.items) {
        await tx.inventory.update({
          where: { storeId_productId: { storeId, productId: item.productId } },
          data: { quantity: { increment: item.quantity } },
        });
      }

      return updated;
    });
  }

  async getDailySales(storeId: string, date: Date = new Date()) {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const sales = await this.prisma.sale.findMany({
      where: { storeId, createdAt: { gte: startOfDay, lte: endOfDay }, status: 'completed' },
      include: { items: true },
    });

    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
    const totalTax = sales.reduce((sum, s) => sum + Number(s.taxAmount), 0);
    const totalDiscount = sales.reduce((sum, s) => sum + Number(s.discountAmount), 0);
    const itemCount = sales.reduce((sum, s) => sum + s.items.length, 0);

    return { totalSales: sales.length, totalRevenue, totalTax, totalDiscount, itemCount };
  }

  async getSalesByPaymentMethod(storeId: string, startDate?: Date, endDate?: Date) {
    const where: any = { storeId, status: 'completed' };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const sales = await this.prisma.sale.findMany({ where, select: { paymentMethod: true, totalAmount: true } });
    const byMethod: Record<string, number> = {};
    
    for (const sale of sales) {
      byMethod[sale.paymentMethod] = (byMethod[sale.paymentMethod] || 0) + Number(sale.totalAmount);
    }

    return byMethod;
  }
}