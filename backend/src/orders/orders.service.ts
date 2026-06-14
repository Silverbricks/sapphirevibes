import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { ReferralsService } from '../referrals/referrals.service';
import { generateOrderNumber } from '../common/utils/order-number.helper';
import { calculateOrderGst } from '../common/utils/gst.helper';
import { getPaginationParams, paginate } from '../common/utils/pagination.helper';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private inventory: InventoryService,
    private referrals: ReferralsService,
  ) {}

  async createFromCart(userId: string, shippingAddressId: string, paymentIntentId?: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { variant: { include: { product: true } } } },
        coupon: true,
      },
    });
    if (!cart || cart.items.length === 0) throw new BadRequestException('Cart is empty');

    const address = await this.prisma.address.findFirst({ where: { id: shippingAddressId, userId } });
    if (!address) throw new NotFoundException('Shipping address not found');

    const orderUser = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!orderUser) throw new NotFoundException('User not found');

    const subtotal = cart.items.reduce((sum, i) => sum + Number(i.unitPrice) * i.quantity, 0);
    let discountAmount = 0;
    if (cart.coupon) {
      if (cart.coupon.type === 'PERCENTAGE') {
        discountAmount = (subtotal * Number(cart.coupon.value)) / 100;
      } else if (cart.coupon.type === 'FIXED') {
        discountAmount = Math.min(Number(cart.coupon.value), subtotal);
      }
    }
    const discountedSubtotal = subtotal - discountAmount;
    const gstAmount = calculateOrderGst(discountedSubtotal);
    const shippingCost = discountedSubtotal >= 150 ? 0 : 12.95;
    const total = discountedSubtotal + shippingCost;

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          email: orderUser.email,
          shippingAddress: address as Prisma.InputJsonValue,
          billingAddress: address as Prisma.InputJsonValue,
          shippingAddressId: address.id,
          subtotal,
          discountAmount,
          gstAmount,
          shippingCost,
          total,
          currency: 'AUD',
          couponId: cart.couponId,
          paymentIntentId,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.variant.product.name,
              variantName: item.variant.name,
              sku: item.variant.sku,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              gstRate: item.variant.product.gstRate,
              lineTotal: Number(item.unitPrice) * item.quantity,
            })),
          },
          statusHistory: {
            create: { status: 'PENDING' },
          },
        },
        include: { items: true },
      });

      // Reserve inventory
      for (const item of cart.items) {
        await this.inventory.reserve(item.variantId, item.quantity, created.id);
      }

      // Clear cart
      await tx.cart.update({ where: { id: cart.id }, data: { couponId: null } });
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    // Convert referral if this is the user's first order and they were referred
    const referralUser = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (referralUser) {
      await this.referrals.convertReferral(userId, order.id).catch(() => {/* non-critical — don't fail order */});
    }

    return order;
  }

  async findUserOrders(userId: string, page = 1, limit = 10) {
    const { skip, take } = getPaginationParams(page, limit);
    const [total, data] = await Promise.all([
      this.prisma.order.count({ where: { userId } }),
      this.prisma.order.findMany({
        where: { userId },
        skip, take,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
    ]);
    return paginate(data, total, page, take);
  }

  async findById(id: string, userId?: string) {
    const where: Prisma.OrderWhereInput = { id };
    if (userId) where.userId = userId;
    const order = await this.prisma.order.findFirst({ where, include: { items: true, statusHistory: { orderBy: { createdAt: 'asc' } } } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus, notes?: string, adminId?: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.$transaction([
      this.prisma.order.update({ where: { id }, data: { status } }),
      this.prisma.orderStatusHistory.create({ data: { orderId: id, status, notes, createdByUserId: adminId } }),
    ]);
  }

  async findAll(page = 1, limit = 20, status?: OrderStatus) {
    const { skip, take } = getPaginationParams(page, limit);
    const where: Prisma.OrderWhereInput = status ? { status } : {};
    const [total, data] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where, skip, take,
        orderBy: { createdAt: 'desc' },
        include: { items: { take: 3 } },
      }),
    ]);
    return paginate(data, total, page, take);
  }
}
