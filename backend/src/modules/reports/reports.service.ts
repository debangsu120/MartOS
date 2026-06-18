import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics(storeId: string, startDate?: Date, endDate?: Date) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const sales = await this.prisma.sale.findMany({
      where: { storeId, status: 'completed', createdAt: { gte: start, lte: end } },
      include: { items: true },
    });

    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
    const totalTax = sales.reduce((sum, s) => sum + Number(s.taxAmount), 0);
    const totalDiscount = sales.reduce((sum, s) => sum + Number(s.discountAmount), 0);
    const totalCost = sales.reduce((sum: number, s: any) => {
      return sum + s.items.reduce((itemSum: number, item: any) => itemSum + Number(item.costPrice) * item.quantity, 0);
    }, 0);

    const totalOrders = sales.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const profit = totalRevenue - totalTax - totalCost;

    const products = await this.prisma.product.count({ where: { storeId, isActive: true } });
    
    const lowStockResult = await this.prisma.inventory.findMany({
      where: {
        storeId,
        product: { isActive: true },
      },
      select: {
        quantity: true,
        product: { select: { lowStockAlert: true } },
      },
    });
    const lowStockCount = lowStockResult.filter(inv => inv.quantity <= inv.product.lowStockAlert).length;

    return {
      revenue: { total: totalRevenue, tax: totalTax, discount: totalDiscount },
      profit: { amount: profit, margin: totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0 },
      orders: { total: totalOrders, averageValue: averageOrderValue },
      products: { total: products, lowStock: lowStockCount },
    };
  }

  async getSalesTrend(storeId: string, days: number = 7) {
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const sales = await this.prisma.sale.findMany({
      where: { storeId, status: 'completed', createdAt: { gte: start } },
      select: { createdAt: true, totalAmount: true },
    });

    const dailySales: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = date.toISOString().split('T')[0];
      dailySales[key] = 0;
    }

    for (const sale of sales) {
      const key = sale.createdAt.toISOString().split('T')[0];
      if (dailySales[key] !== undefined) {
        dailySales[key] += Number(sale.totalAmount);
      }
    }

    return Object.entries(dailySales).map(([date, revenue]) => ({ date, revenue })).reverse();
  }

  async getTopProducts(storeId: string, limit: number = 10, startDate?: Date, endDate?: Date) {
    const where: any = { storeId, status: 'completed' };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const sales = await this.prisma.sale.findMany({ 
      where, 
      include: { items: { include: { product: true } } } 
    });

    const productSales: any = {};
    for (const sale of sales) {
      for (const item of sale.items) {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { productId: item.productId, name: item.product.name, quantity: 0, revenue: 0 };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += Number(item.totalAmount);
      }
    }

    return Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, limit);
  }

  async getCategorySales(storeId: string, startDate?: Date, endDate?: Date) {
    const where: any = { storeId, status: 'completed' };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const sales = await this.prisma.sale.findMany({ 
      where, 
      include: { items: { include: { product: { include: { category: true } } } } } 
    });

    const categorySales: any = {};
    for (const sale of sales) {
      for (const item of sale.items) {
        const catId = item.product.categoryId || 'uncategorized';
        const catName = item.product.category?.name || 'Uncategorized';
        if (!categorySales[catId]) {
          categorySales[catId] = { categoryId: catId, categoryName: catName, revenue: 0 };
        }
        categorySales[catId].revenue += Number(item.totalAmount);
      }
    }

    return Object.values(categorySales).sort((a: any, b: any) => b.revenue - a.revenue);
  }

  async getHourlySales(storeId: string, date?: Date) {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const sales = await this.prisma.sale.findMany({
      where: { storeId, status: 'completed', createdAt: { gte: startOfDay, lte: endOfDay } },
      select: { createdAt: true, totalAmount: true },
    });

    const hourlySales: number[] = new Array(24).fill(0);
    for (const sale of sales) {
      const hour = sale.createdAt.getHours();
      hourlySales[hour] += Number(sale.totalAmount);
    }

    return hourlySales.map((revenue, hour) => ({ hour, revenue }));
  }

  async getInventoryValue(storeId: string) {
    const inventory = await this.prisma.inventory.findMany({
      where: { storeId },
      include: { product: true },
    });

    let totalCost = 0;
    let totalRetail = 0;
    for (const inv of inventory) {
      const cost = Number(inv.product.costPrice) * inv.quantity;
      const retail = Number(inv.product.sellingPrice) * inv.quantity;
      totalCost += cost;
      totalRetail += retail;
    }

    return { costValue: totalCost, retailValue: totalRetail, potentialProfit: totalRetail - totalCost };
  }
}