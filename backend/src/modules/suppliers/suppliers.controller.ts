import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('manager', 'owner')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  async findAll(@Request() req, @Query('search') search?: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.suppliersService.findAll(storeId, search);
  }

  @Get('purchase-orders')
  async findPurchaseOrders(
    @Request() req,
    @Query('supplierId') supplierId?: string,
    @Query('status') status?: string,
  ) {
    const storeId = req.user.stores[0]?.storeId;
    return this.suppliersService.findPurchaseOrders(storeId, supplierId, status);
  }

  @Post()
  async create(@Request() req, @Body() body: any) {
    const storeId = req.user.stores[0]?.storeId;
    return this.suppliersService.create(storeId, body);
  }

  @Post('purchase-orders')
  async createPurchaseOrder(@Request() req, @Body() body: any) {
    const storeId = req.user.stores[0]?.storeId;
    const userId = req.user.userId;
    return this.suppliersService.createPurchaseOrder(storeId, userId, body);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.suppliersService.findOne(storeId, id);
  }

  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    const storeId = req.user.stores[0]?.storeId;
    return this.suppliersService.update(storeId, id, body);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.suppliersService.delete(storeId, id);
  }

  @Patch('purchase-orders/:id/receive')
  async receivePurchaseOrder(@Request() req, @Param('id') id: string, @Body() body: any) {
    const storeId = req.user.stores[0]?.storeId;
    return this.suppliersService.receivePurchaseOrder(storeId, id, body);
  }
}