import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getAllSettings(@Request() req) {
    const storeId = req.user.stores[0]?.storeId;
    return this.settingsService.getAllSettings(storeId);
  }

  @Get('store')
  async getStoreInfo(@Request() req) {
    const storeId = req.user.stores[0]?.storeId;
    return this.settingsService.getStoreInfo(storeId);
  }

  @Post(':key')
  async setSetting(@Request() req, @Param('key') key: string, @Body() body: { value: any }) {
    const storeId = req.user.stores[0]?.storeId;
    return this.settingsService.setSetting(storeId, key, body.value);
  }

  @Get(':key')
  async getSetting(@Request() req, @Param('key') key: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.settingsService.getSetting(storeId, key);
  }

  @Delete(':key')
  async deleteSetting(@Request() req, @Param('key') key: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.settingsService.deleteSetting(storeId, key);
  }

  @Patch('store')
  async updateStore(@Request() req, @Body() body: any) {
    const storeId = req.user.stores[0]?.storeId;
    return this.settingsService.updateStoreSettings(storeId, body);
  }
}