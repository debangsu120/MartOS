import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(storeId: string, userId?: string, unreadOnly = false) {
    const where: any = { storeId };
    if (userId) where.userId = userId;
    if (unreadOnly) where.isRead = false;

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getUnreadCount(storeId: string, userId?: string) {
    const where: any = { storeId, isRead: false };
    if (userId) where.userId = userId;

    return this.prisma.notification.count({ where });
  }

  async create(storeId: string, data: { type: string; title: string; message: string; userId?: string; actionUrl?: string; actionLabel?: string }) {
    return this.prisma.notification.create({
      data: { ...data, storeId },
    });
  }

  async markAsRead(storeId: string, notificationId: string, userId?: string) {
    const where: any = { id: notificationId, storeId };
    if (userId) where.userId = userId;

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(storeId: string, userId?: string) {
    const where: any = { storeId, isRead: false };
    if (userId) where.userId = userId;

    return this.prisma.notification.updateMany({
      where,
      data: { isRead: true, readAt: new Date() },
    });
  }

  async delete(storeId: string, notificationId: string) {
    return this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  async createLowStockAlert(storeId: string, productName: string, currentStock: number) {
    return this.create(storeId, {
      type: 'low_stock',
      title: 'Low Stock Alert',
      message: `${productName} is running low (${currentStock} remaining)`,
      actionUrl: `/inventory?product=${productName}`,
      actionLabel: 'View Inventory',
    });
  }
}