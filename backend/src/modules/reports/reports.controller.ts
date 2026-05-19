import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  async getDashboard(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const storeId = req.user.stores[0]?.storeId;
    return this.reportsService.getDashboardMetrics(
      storeId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('sales-trend')
  async getSalesTrend(@Request() req, @Query('days') days?: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.reportsService.getSalesTrend(storeId, days ? parseInt(days) : 7);
  }

  @Get('top-products')
  async getTopProducts(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const storeId = req.user.stores[0]?.storeId;
    return this.reportsService.getTopProducts(
      storeId,
      limit ? parseInt(limit) : 10,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('categories')
  async getCategorySales(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const storeId = req.user.stores[0]?.storeId;
    return this.reportsService.getCategorySales(
      storeId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('hourly')
  async getHourlySales(@Request() req, @Query('date') date?: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.reportsService.getHourlySales(storeId, date ? new Date(date) : undefined);
  }

  @Get('inventory-value')
  async getInventoryValue(@Request() req) {
    const storeId = req.user.stores[0]?.storeId;
    return this.reportsService.getInventoryValue(storeId);
  }
}