import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, InventoryChangeReason } from '@prisma/client';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get(':variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  getByVariant(@Param('variantId') variantId: string) {
    return this.inventoryService.getByVariant(variantId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  getLowStock(@Query('threshold') threshold?: number) {
    return this.inventoryService.getLowStock(threshold);
  }

  @Post(':variantId/adjust')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  adjust(
    @Param('variantId') variantId: string,
    @Body() body: { quantity: number; reason: InventoryChangeReason; referenceId?: string },
  ) {
    return this.inventoryService.adjust(variantId, body.quantity, body.reason, body.referenceId);
  }
}
