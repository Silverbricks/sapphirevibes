import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}
  @Get('my') get(@CurrentUser() u: { id: string }) { return this.wishlistsService.get(u.id); }
  @Post('my') add(@CurrentUser() u: { id: string }, @Body() b: { productId: string; variantId?: string }) { return this.wishlistsService.add(u.id, b.productId, b.variantId); }
  @Delete('my/:productId') remove(@CurrentUser() u: { id: string }, @Param('productId') pid: string) { return this.wishlistsService.remove(u.id, pid); }
}
