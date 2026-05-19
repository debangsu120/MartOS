import { Controller, Get, Patch, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Request() req, @Query('unread') unread?: string) {
    const storeId = req.user.stores[0]?.storeId;
    const userId = req.user.userId;
    return this.notificationsService.findAll(storeId, userId, unread === 'true');
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const storeId = req.user.stores[0]?.storeId;
    const userId = req.user.userId;
    return this.notificationsService.getUnreadCount(storeId, userId);
  }

  @Patch(':id/read')
  async markAsRead(@Request() req, @Param('id') id: string) {
    const storeId = req.user.stores[0]?.storeId;
    const userId = req.user.userId;
    return this.notificationsService.markAsRead(storeId, id, userId);
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req) {
    const storeId = req.user.stores[0]?.storeId;
    const userId = req.user.userId;
    return this.notificationsService.markAllAsRead(storeId, userId);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    const storeId = req.user.stores[0]?.storeId;
    return this.notificationsService.delete(storeId, id);
  }
}