import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async findAll(@Request() req, @Query('search') search?: string, @Query('lowStock') lowStock?: string) {
    const storeId = req.user?.stores?.[0]?.storeId;
    if (!storeId) return [];
    return this.inventoryService.findAll(storeId, { search, lowStock: lowStock === 'true' });
  }

  @Get('summary')
  async getSummary(@Request() req) {
    const storeId = req.user?.stores?.[0]?.storeId;
    if (!storeId) {
      return { total_products: BigInt(0), total_quantity: BigInt(0), low_stock_count: BigInt(0) };
    }
    return this.inventoryService.getStockSummary(storeId);
  }

  @Get('low-stock')
  async getLowStock(@Request() req) {
    const storeId = req.user?.stores?.[0]?.storeId;
    if (!storeId) return [];
    return this.inventoryService.getLowStock(storeId);
  }

  @Get('logs')
  async getLogs(@Request() req, @Query('productId') productId?: string, @Query('limit') limit?: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.inventoryService.getInventoryLogs(storeId, productId, limit ? parseInt(limit) : 50);
  }

  @Get(':productId')
  async findOne(@Request() req, @Param('productId') productId: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.inventoryService.findOne(storeId, productId);
  }

  @Patch(':productId/adjust')
  @Roles('manager', 'owner')
  async adjustStock(
    @Request() req,
    @Param('productId') productId: string,
    @Body() body: { type: string; quantity: number; reason?: string; notes?: string },
  ) {
    const storeId = req.user.stores[0]?.storeId;
    const userId = req.user.userId;
    return this.inventoryService.adjustStock(storeId, productId, userId, body);
  }
}