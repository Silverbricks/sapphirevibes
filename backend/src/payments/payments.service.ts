import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(config.get<string>('STRIPE_SECRET_KEY', ''), {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(amount: number, currency = 'aud', metadata?: Record<string, string>) {
    const intentAmount = Math.round(amount * 100); // Stripe uses cents
    return this.stripe.paymentIntents.create({
      amount: intentAmount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: metadata ?? {},
    });
  }

  async getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
    // stripeCustomerId added to schema — cast until prisma generate is run
    const user = await (this.prisma.user as any).findUnique({ where: { id: userId }, select: { stripeCustomerId: true } });

    if (user?.stripeCustomerId) return user.stripeCustomerId as string;

    const customer = await this.stripe.customers.create({ email, metadata: { userId } });
    await (this.prisma.user as any).update({ where: { id: userId }, data: { stripeCustomerId: customer.id } });
    return customer.id;
  }

  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET', '');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case 'invoice.payment_succeeded':
        // Handled by SubscriptionsService
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // Handled by SubscriptionsService
        break;
    }

    return { received: true };
  }

  private async handlePaymentSuccess(intent: Stripe.PaymentIntent) {
    if (!intent.metadata?.orderId) return;
    await this.prisma.order.update({
      where: { id: intent.metadata.orderId },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
    });
  }

  private async handlePaymentFailed(intent: Stripe.PaymentIntent) {
    if (!intent.metadata?.orderId) return;
    await this.prisma.order.update({
      where: { id: intent.metadata.orderId },
      data: { paymentStatus: 'FAILED', status: 'CANCELLED' },
    });
  }
}
