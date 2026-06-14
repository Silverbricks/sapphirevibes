import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateReviewDto {
  rating: number;
  title?: string;
  body: string;
  orderId?: string;
}

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getForProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, isApproved: true },
      include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async create(userId: string, productId: string, dto: CreateReviewDto) {
    // Prevent duplicate reviews for the same product
    const existing = await this.prisma.review.findFirst({ where: { userId, productId } });
    if (existing) throw new BadRequestException('You have already reviewed this product');

    // Check for a completed order containing this product
    const verifiedOrder = await this.prisma.orderItem.findFirst({
      where: { productId, order: { userId, status: 'DELIVERED' } },
    });

    return this.prisma.review.create({
      data: {
        userId,
        productId,
        orderId: (dto.orderId ?? verifiedOrder?.orderId ?? '') as string,
        rating: dto.rating,
        title: dto.title,
        body: dto.body,
        isVerifiedPurchase: !!verifiedOrder,
        isApproved: false, // Requires admin moderation before showing
      },
    });
  }

  // ── Admin moderation ─────────────────────────────────────────────────────

  async getPendingReviews(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
      this.prisma.review.count({ where: { isApproved: false } }),
      this.prisma.review.findMany({
        where: { isApproved: false },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          product: { select: { name: true, slug: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { data, total, page, pages: Math.ceil(total / limit) };
  }

  async approveReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    return this.prisma.review.update({ where: { id }, data: { isApproved: true } });
  }

  async rejectReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    return this.prisma.review.delete({ where: { id } });
  }
}
