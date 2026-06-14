import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async getActivePromotions() {
    const now = new Date();
    return {
      coupons: await this.prisma.coupon.findMany({
        where: { isActive: true, validFrom: { lte: now }, validUntil: { gte: now } },
        select: { code: true, type: true, value: true, minOrderAmount: true, validUntil: true },
      }),
      flashSales: await this.prisma.flashSale.findMany({
        where: { isActive: true, startAt: { lte: now }, endAt: { gte: now } },
        include: { products: { include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } }, take: 8 } },
      }),
    };
  }

  async validateCoupon(code: string, subtotal: number, userId?: string) {
    const now = new Date();
    const coupon = await this.prisma.coupon.findFirst({
      where: { code: code.toUpperCase(), isActive: true, validFrom: { lte: now }, validUntil: { gte: now } },
    });

    if (!coupon) return { valid: false, message: 'Invalid or expired coupon' };
    if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
      return { valid: false, message: `Minimum order of $${coupon.minOrderAmount} required` };
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, message: 'Coupon usage limit reached' };
    }

    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = (subtotal * Number(coupon.value)) / 100;
      if (coupon.maxDiscountAmount) discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
    } else if (coupon.type === 'FIXED') {
      discountAmount = Math.min(Number(coupon.value), subtotal);
    }

    return { valid: true, coupon, discountAmount };
  }
}
