import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async create(@Request() req, @Body() body: any) {
    const storeId = req.user.stores[0]?.storeId;
    const userId = req.user.userId;
    return this.salesService.createSale(storeId, userId, body);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
  ) {
    const storeId = req.user.stores[0]?.storeId;
    return this.salesService.findAll(storeId, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      status,
    });
  }

  @Get('daily')
  async getDailySales(@Request() req, @Query('date') date?: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.salesService.getDailySales(storeId, date ? new Date(date) : undefined);
  }

  @Get('payment-methods')
  async getSalesByPaymentMethod(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const storeId = req.user.stores[0]?.storeId;
    return this.salesService.getSalesByPaymentMethod(
      storeId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.salesService.findOne(storeId, id);
  }

  @Patch(':id/void')
  @Roles('manager', 'owner')
  async voidSale(@Request() req, @Param('id') id: string, @Body() body: { reason: string }) {
    const storeId = req.user.stores[0]?.storeId;
    const userId = req.user.userId;
    return this.salesService.voidSale(storeId, id, userId, body.reason);
  }
}