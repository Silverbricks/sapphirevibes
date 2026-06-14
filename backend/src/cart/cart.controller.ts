import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  private getContext(req: Request, user?: { id: string }) {
    const sessionId = (req.cookies?.['sv-session'] ?? req.headers['x-session-id']) as string | undefined;
    return { userId: user?.id, sessionId };
  }

  @Get()
  get(@Req() req: Request, @CurrentUser() user?: { id: string }) {
    const { userId, sessionId } = this.getContext(req, user);
    return this.cartService.getCart(userId, sessionId);
  }

  @Post('items')
  addItem(
    @Req() req: Request,
    @Body() body: { variantId: string; quantity: number },
    @CurrentUser() user?: { id: string },
  ) {
    const { userId, sessionId } = this.getContext(req, user);
    return this.cartService.addItem(body.variantId, body.quantity, userId, sessionId);
  }

  @Patch('items/:itemId')
  updateItem(
    @Req() req: Request,
    @Param('itemId') itemId: string,
    @Body() body: { quantity: number },
    @CurrentUser() user?: { id: string },
  ) {
    const { userId, sessionId } = this.getContext(req, user);
    return this.cartService.updateQuantity(itemId, body.quantity, userId, sessionId);
  }

  @Delete('items/:itemId')
  removeItem(
    @Req() req: Request,
    @Param('itemId') itemId: string,
    @CurrentUser() user?: { id: string },
  ) {
    const { userId, sessionId } = this.getContext(req, user);
    return this.cartService.removeItem(itemId, userId, sessionId);
  }

  @Post('coupon')
  applyCoupon(
    @Req() req: Request,
    @Body() body: { code: string },
    @CurrentUser() user?: { id: string },
  ) {
    const { userId, sessionId } = this.getContext(req, user);
    return this.cartService.applyCoupon(body.code, userId, sessionId);
  }

  @Delete('coupon')
  removeCoupon(@Req() req: Request, @CurrentUser() user?: { id: string }) {
    const { userId, sessionId } = this.getContext(req, user);
    return this.cartService.removeCoupon(userId, sessionId);
  }

  @Post('merge')
  @UseGuards(JwtAuthGuard)
  merge(@CurrentUser() user: { id: string }, @Body() body: { sessionId: string }) {
    return this.cartService.mergeGuestCart(user.id, body.sessionId);
  }
}
