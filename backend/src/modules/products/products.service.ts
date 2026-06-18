import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(storeId: string, query: { page?: number; limit?: number; search?: string; categoryId?: string; isFeatured?: boolean; isActive?: boolean }) {
    const { page = 1, limit = 20, search, categoryId, isFeatured, isActive = true } = query;
    const skip = (page - 1) * limit;

    const where: any = { storeId };
    if (search) {
      const searchLower = search.toLowerCase();
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
        { name: { startsWith: search, mode: 'insensitive' } },
        { sku: { startsWith: search, mode: 'insensitive' } },
      ];
      where.AND = where.AND || [];
      where.AND.push({
        OR: [
          { name: { contains: searchLower.split(' ')[0] } },
          { sku: { contains: searchLower.split(' ')[0] } },
        ],
      });
    }
    if (categoryId) where.categoryId = categoryId;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;
    if (isActive !== undefined) where.isActive = isActive;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true, inventory: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items: products, total, page, limit };
  }

  async findOne(storeId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, storeId },
      include: { category: true, inventory: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findByBarcode(storeId: string, barcode: string) {
    return this.prisma.product.findFirst({
      where: { storeId, barcode },
      include: { inventory: true },
    });
  }

  async create(storeId: string, data: any) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const { rackLocation, shelfLocation, initialStock, ...productData } = data;
    
    const product = await this.prisma.product.create({
      data: { ...productData, storeId, slug },
    });

    await this.prisma.inventory.create({
      data: {
        storeId,
        productId: product.id,
        quantity: initialStock || 0,
        rackLocation: rackLocation || null,
        shelfLocation: shelfLocation || null,
      },
    });

    return product;
  }

  async update(id: string, data: any) {
    return this.prisma.product.update({ where: { id }, data, include: { inventory: true } });
  }

  async delete(id: string) {
    return this.prisma.product.update({ where: { id }, data: { isActive: false } });
  }

  async getCategories(storeId: string, parentId?: string) {
    return this.prisma.category.findMany({
      where: { storeId, isActive: true, ...(parentId ? { parentId } : { parentId: null }) },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async createCategory(storeId: string, data: any) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.prisma.category.create({
      data: { ...data, storeId, slug },
    });
  }

  async updateCategory(storeId: string, id: string, data: any) {
    const category = await this.prisma.category.findFirst({ where: { id, storeId } });
    if (!category) throw new NotFoundException('Category not found');
    return this.prisma.category.update({ where: { id }, data });
  }

  async deleteCategory(storeId: string, id: string) {
    const category = await this.prisma.category.findFirst({ where: { id, storeId } });
    if (!category) throw new NotFoundException('Category not found');
    return this.prisma.category.update({ where: { id }, data: { isActive: false } });
  }
}