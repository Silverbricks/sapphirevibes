import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalRevenueMtd, totalRevenueYtd, ordersToday, totalOrders,
      activeSubscriptions, totalCustomers, lowStockCount,
    ] = await Promise.all([
      this.prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: startOfMonth } }, _sum: { total: true } }),
      this.prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: startOfYear } }, _sum: { total: true } }),
      this.prisma.order.count({ where: { createdAt: { gte: today } } }),
      this.prisma.order.count(),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.inventory.count({ where: { quantityOnHand: { lte: 5 } } }),
    ]);

    return {
      revenue: { mtd: totalRevenueMtd._sum.total ?? 0, ytd: totalRevenueYtd._sum.total ?? 0 },
      orders: { today: ordersToday, total: totalOrders },
      subscriptions: { active: activeSubscriptions },
      customers: { total: totalCustomers },
      alerts: { lowStock: lowStockCount },
    };
  }

  async getSalesOverTime(days = 30) {
    const from = new Date();
    from.setDate(from.getDate() - days);

    const orders = await this.prisma.order.findMany({
      where: { paymentStatus: 'PAID', createdAt: { gte: from } },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: 'asc' },
    });

    const grouped: Record<string, number> = {};
    for (const order of orders) {
      const day = order.createdAt.toISOString().split('T')[0];
      grouped[day] = (grouped[day] ?? 0) + Number(order.total);
    }

    return Object.entries(grouped).map(([date, revenue]) => ({ date, revenue }));
  }

  async getProductPerformance() {
    return this.prisma.orderItem.groupBy({
      by: ['productId', 'productName'],
      _sum: { quantity: true, lineTotal: true },
      orderBy: { _sum: { lineTotal: 'desc' } },
      take: 20,
    });
  }
}
