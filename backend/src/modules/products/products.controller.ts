import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Request() req,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('isActive') isActive?: string,
  ) {
    const storeId = req.user.stores?.[0]?.storeId;
    if (!storeId) {
      return { items: [], total: 0, page: 1, limit: 20 };
    }
    try {
      return await this.productsService.findAll(storeId, { categoryId, search, isFeatured: isFeatured === 'true', isActive: isActive !== 'false' });
    } catch (error) {
      console.error('Products findAll error:', error);
      throw error;
    }
  }

  @Get('categories')
  async getCategories(@Request() req, @Query('parentId') parentId?: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.productsService.getCategories(storeId, parentId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.productsService.findOne(storeId, id);
  }

  @Post()
  async create(@Request() req, @Body() body: any) {
    const storeId = req.user.stores[0]?.storeId;
    return this.productsService.create(storeId, body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  @Post('categories')
  async createCategory(@Request() req, @Body() body: any) {
    const storeId = req.user.stores[0]?.storeId;
    return this.productsService.createCategory(storeId, body);
  }

  @Patch('categories/:id')
  async updateCategory(@Request() req, @Param('id') id: string, @Body() body: any) {
    const storeId = req.user.stores[0]?.storeId;
    return this.productsService.updateCategory(storeId, id, body);
  }

  @Delete('categories/:id')
  async deleteCategory(@Request() req, @Param('id') id: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.productsService.deleteCategory(storeId, id);
  }
}