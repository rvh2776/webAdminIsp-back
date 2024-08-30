import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notificaciones')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('send-monthly-notifications')
  async sendMonthlyNotifications(): Promise<void> {
    return this.notificationsService.sendMonthlyNotificationsWithAttachments();
  }

  // Puedes agregar más endpoints según sea necesario
}
