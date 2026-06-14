import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role, OrderStatus } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() body: { shippingAddressId: string; paymentIntentId?: string },
  ) {
    return this.ordersService.createFromCart(user.id, body.shippingAddressId, body.paymentIntentId);
  }

  @Get('my')
  findMine(@CurrentUser() user: { id: string }, @Query('page') page?: number) {
    return this.ordersService.findUserOrders(user.id, page);
  }

  @Get('my/:id')
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.ordersService.findById(id, user.id);
  }

  // Admin routes
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  findAll(@Query('page') page?: number, @Query('status') status?: OrderStatus) {
    return this.ordersService.findAll(page, 20, status);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus; notes?: string },
    @CurrentUser() user: { id: string },
  ) {
    return this.ordersService.updateStatus(id, body.status, body.notes, user.id);
  }
}
