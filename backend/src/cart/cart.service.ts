import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { REDIS_CLIENT } from '../redis/redis.module';
import Redis from 'ioredis';
import { Prisma } from '@prisma/client';

const CART_TTL = 60 * 60 * 24 * 7; // 7 days
const ABANDONED_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(REDIS_CLIENT) private redis: Redis,
  ) {}

  @Cron('0 */2 * * *') // Every 2 hours
  async sendAbandonedCartEmails() {
    const threshold = new Date(Date.now() - ABANDONED_THRESHOLD_MS);
    // Use `as any` for new schema fields until `prisma generate` is run after migration
    const abandonedCarts = await (this.prisma.cart as any).findMany({
      where: {
        userId: { not: null },
        recoveryEmailSentAt: null,
        updatedAt: { lt: threshold },
        items: { some: {} },
      },
      include: {
        items: { include: { variant: { include: { product: true } } } },
        user: { select: { id: true, email: true, firstName: true } },
      },
      take: 50,
    });

    for (const cart of abandonedCarts) {
      const user = cart.user as { id: string; email: string; firstName: string } | null;
      if (!user?.email) continue;
      try {
        const code = `BACK${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        await this.prisma.coupon.create({
          data: {
            code,
            type: 'PERCENTAGE',
            value: 10,
            isActive: true,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000),
            usageLimit: 1,
          },
        });

        this.logger.log(`Abandoned cart recovery: would send email to ${user.email} with code ${code}`);

        await (this.prisma.cart as any).update({
          where: { id: cart.id },
          data: { recoveryEmailSentAt: new Date() },
        });
      } catch (err) {
        this.logger.error(`Failed to process abandoned cart ${cart.id}`, err);
      }
    }

    this.logger.log(`Processed ${abandonedCarts.length} abandoned carts`);
  }

  async getCart(userId?: string, sessionId?: string) {
    const key = this.cartKey(userId, sessionId);
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached);

    const cart = userId
      ? await this.prisma.cart.findUnique({
          where: { userId },
          include: { items: { include: { variant: { include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } } } } }, coupon: true },
        })
      : null;

    if (!cart) return this.emptyCart();
    const summary = this.calculateSummary(cart as any);
    await this.redis.setex(key, CART_TTL, JSON.stringify({ ...cart, ...summary }));
    return { ...cart, ...summary };
  }

  async addItem(variantId: string, quantity: number, userId?: string, sessionId?: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true, inventory: true },
    });
    if (!variant) throw new NotFoundException('Product variant not found');
    if (!variant.inventory || variant.inventory.quantityOnHand - variant.inventory.quantityReserved < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const cart = await this.getOrCreateCart(userId, sessionId);
    const unitPrice = Number(variant.product.basePrice) + Number(variant.priceModifier);

    const existingItem = cart.items.find((i) => i.variantId === variantId);
    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, productId: variant.productId, variantId, quantity, unitPrice },
      });
    }

    await this.invalidateCache(userId, sessionId);
    return this.getCart(userId, sessionId);
  }

  async updateQuantity(itemId: string, quantity: number, userId?: string, sessionId?: string) {
    if (quantity <= 0) return this.removeItem(itemId, userId, sessionId);
    await this.prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    await this.invalidateCache(userId, sessionId);
    return this.getCart(userId, sessionId);
  }

  async removeItem(itemId: string, userId?: string, sessionId?: string) {
    await this.prisma.cartItem.delete({ where: { id: itemId } });
    await this.invalidateCache(userId, sessionId);
    return this.getCart(userId, sessionId);
  }

  async applyCoupon(code: string, userId?: string, sessionId?: string) {
    const coupon = await this.prisma.coupon.findFirst({
      where: { code: code.toUpperCase(), isActive: true, validUntil: { gte: new Date() } },
    });
    if (!coupon) throw new BadRequestException('Invalid or expired coupon code');

    const cart = await this.getOrCreateCart(userId, sessionId);
    await this.prisma.cart.update({ where: { id: cart.id }, data: { couponId: coupon.id } });
    await this.invalidateCache(userId, sessionId);
    return this.getCart(userId, sessionId);
  }

  async removeCoupon(userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);
    await this.prisma.cart.update({ where: { id: cart.id }, data: { couponId: null } });
    await this.invalidateCache(userId, sessionId);
    return this.getCart(userId, sessionId);
  }

  async mergeGuestCart(userId: string, sessionId: string) {
    const guestCart = await this.prisma.cart.findFirst({ where: { sessionId }, include: { items: true } });
    if (!guestCart || guestCart.items.length === 0) return;

    for (const item of guestCart.items) {
      await this.addItem(item.variantId, item.quantity, userId);
    }
    await this.prisma.cart.delete({ where: { id: guestCart.id } });
    await this.redis.del(this.cartKey(undefined, sessionId));
  }

  private calculateSummary(cart: { items: Array<{ unitPrice: number | string; quantity: number }>; coupon?: { type: string; value: number | string; maxDiscountAmount?: number | string | null } | null }) {
    const subtotal = cart.items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
    let discountAmount = 0;

    if (cart.coupon) {
      if (cart.coupon.type === 'PERCENTAGE') {
        discountAmount = (subtotal * Number(cart.coupon.value)) / 100;
        if (cart.coupon.maxDiscountAmount) discountAmount = Math.min(discountAmount, Number(cart.coupon.maxDiscountAmount));
      } else if (cart.coupon.type === 'FIXED') {
        discountAmount = Math.min(Number(cart.coupon.value), subtotal);
      }
    }

    const discountedSubtotal = subtotal - discountAmount;
    const gstAmount = discountedSubtotal * 0.1 / 1.1; // extract GST from GST-inclusive price
    const shippingCost = discountedSubtotal >= 150 ? 0 : 12.95;
    const total = discountedSubtotal + shippingCost;

    return { subtotal, discountAmount, gstAmount, shippingCost, total };
  }

  private async getOrCreateCart(userId?: string, sessionId?: string) {
    if (userId) {
      return this.prisma.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
        include: { items: true },
      });
    }
    const existing = await this.prisma.cart.findFirst({ where: { sessionId }, include: { items: true } });
    if (existing) return existing;
    return this.prisma.cart.create({ data: { sessionId }, include: { items: true } });
  }

  private cartKey(userId?: string, sessionId?: string) {
    return userId ? `cart:user:${userId}` : `cart:session:${sessionId}`;
  }

  private async invalidateCache(userId?: string, sessionId?: string) {
    await this.redis.del(this.cartKey(userId, sessionId));
  }

  private emptyCart() {
    return { items: [], subtotal: 0, discountAmount: 0, gstAmount: 0, shippingCost: 12.95, total: 12.95 };
  }
}
