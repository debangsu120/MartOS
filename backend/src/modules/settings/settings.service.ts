import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSetting(storeId: string, key: string) {
    const setting = await this.prisma.storeSetting.findUnique({
      where: { storeId_key: { storeId, key } },
    });
    return setting?.value;
  }

  async setSetting(storeId: string, key: string, value: any) {
    return this.prisma.storeSetting.upsert({
      where: { storeId_key: { storeId, key } },
      create: { storeId, key, value },
      update: { value },
    });
  }

  async getAllSettings(storeId: string) {
    const settings = await this.prisma.storeSetting.findMany({
      where: { storeId },
    });
    return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  }

  async deleteSetting(storeId: string, key: string) {
    const setting = await this.prisma.storeSetting.findUnique({
      where: { storeId_key: { storeId, key } },
    });
    if (!setting) throw new NotFoundException('Setting not found');
    return this.prisma.storeSetting.delete({ where: { storeId_key: { storeId, key } } });
  }

  async updateStoreSettings(storeId: string, data: { name?: string; logo?: string; address?: string; phone?: string; email?: string; gstNumber?: string; taxNumber?: string; timezone?: string; currency?: string }) {
    return this.prisma.store.update({
      where: { id: storeId },
      data,
    });
  }

  async getStoreInfo(storeId: string) {
    return this.prisma.store.findUnique({
      where: { id: storeId },
      include: { settings: true },
    });
  }
}