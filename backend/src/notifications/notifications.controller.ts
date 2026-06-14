import { Controller, Get, Post, Patch, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMy(@CurrentUser() u: { id: string }) {
    return this.notificationsService.getMyNotifications(u.id);
  }

  @Patch('my/:id/read')
  @UseGuards(JwtAuthGuard)
  markRead(@Param('id') id: string, @CurrentUser() u: { id: string }) {
    return this.notificationsService.markRead(id, u.id);
  }

  @Post('back-in-stock')
  @HttpCode(HttpStatus.OK)
  registerBackInStock(@Body() body: { productId: string; variantId?: string; email: string }) {
    return this.notificationsService.registerBackInStockInterest(body.productId, body.email, body.variantId);
  }

  @Post('back-in-stock/notify-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  notifyBackInStock(@Body() body: { productId: string }) {
    return this.notificationsService.notifyBackInStockCustomers(body.productId);
  }
}
