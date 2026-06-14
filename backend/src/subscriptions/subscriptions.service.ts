import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.stripe = new Stripe(config.get<string>('STRIPE_SECRET_KEY', ''), { apiVersion: '2023-10-16' });
  }

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
  }

  async getMySubscription(userId: string) {
    return this.prisma.subscription.findUnique({
      where: { userId },
      include: { plan: true },
    });
  }

  async subscribe(userId: string, planId: string, email: string) {
    const existing = await this.prisma.subscription.findUnique({ where: { userId } });
    if (existing && existing.status === 'ACTIVE') throw new BadRequestException('Already subscribed');

    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan not found');

    // Create or get Stripe customer
    let customerId: string;
    const customerSearch = await this.stripe.customers.list({ email, limit: 1 });
    if (customerSearch.data.length > 0) {
      customerId = customerSearch.data[0].id;
    } else {
      const customer = await this.stripe.customers.create({ email, metadata: { userId } });
      customerId = customer.id;
    }

    const stripeSubscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: plan.stripePriceId }],
      metadata: { userId, planId },
    });

    return this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        planId,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: customerId,
        status: 'ACTIVE',
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
      update: {
        planId,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: customerId,
        status: 'ACTIVE',
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: false,
      },
      include: { plan: true },
    });
  }

  async pause(userId: string, reason?: string) {
    const sub = await this.getMySubscription(userId);
    if (!sub) throw new NotFoundException('No active subscription');

    await this.stripe.subscriptions.update(sub.stripeSubscriptionId, {
      pause_collection: { behavior: 'void' },
    });

    return this.prisma.subscription.update({
      where: { userId },
      data: { status: 'PAUSED', pausedAt: new Date(), pauseReason: reason },
    });
  }

  async resume(userId: string) {
    const sub = await this.getMySubscription(userId);
    if (!sub) throw new NotFoundException('No subscription');

    await this.stripe.subscriptions.update(sub.stripeSubscriptionId, {
      pause_collection: '',
    });

    return this.prisma.subscription.update({
      where: { userId },
      data: { status: 'ACTIVE', resumedAt: new Date(), pausedAt: null, pauseReason: null },
    });
  }

  async cancel(userId: string) {
    const sub = await this.getMySubscription(userId);
    if (!sub) throw new NotFoundException('No subscription');

    await this.stripe.subscriptions.update(sub.stripeSubscriptionId, { cancel_at_period_end: true });

    return this.prisma.subscription.update({
      where: { userId },
      data: { cancelAtPeriodEnd: true },
    });
  }

  async getBenefits(userId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { userId },
      include: { plan: true },
    });
    if (!sub || sub.status !== 'ACTIVE') return null;
    return {
      discountPercentage: sub.plan.discountPercentage,
      freeDelivery: sub.plan.freeDelivery,
      exclusiveAccess: sub.plan.exclusiveAccess,
      earlyFestivalDeals: sub.plan.earlyFestivalDeals,
    };
  }
}
