import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get('products/:productId')
  getForProduct(@Param('productId') productId: string) {
    return this.reviewsService.getForProduct(productId);
  }

  @Post('products/:productId')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('productId') productId: string,
    @CurrentUser() user: { id: string },
    @Body() body: { rating: number; title?: string; body: string; orderId?: string },
  ) {
    return this.reviewsService.create(user.id, productId, body);
  }

  // ── Admin moderation ─────────────────────────────────────────────────────

  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  getPending(@Query('page') page?: number) {
    return this.reviewsService.getPendingReviews(page);
  }

  @Patch('admin/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  approve(@Param('id') id: string) {
    return this.reviewsService.approveReview(id);
  }

  @Delete('admin/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  reject(@Param('id') id: string) {
    return this.reviewsService.rejectReview(id);
  }
}
