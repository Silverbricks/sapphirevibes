import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { NotificationType, NotificationChannel } from '@prisma/client';
import { render } from '@react-email/components';
import { OrderConfirmationEmail } from '../emails/order-confirmation';
import { WelcomeEmail } from '../emails/welcome';
import { PasswordResetEmail } from '../emails/password-reset';

@Injectable()
export class NotificationsService {
  private twilioClient: ReturnType<typeof twilio> | null = null;

  constructor(private prisma: PrismaService, private config: ConfigService) {
    sgMail.setApiKey(config.get<string>('SENDGRID_API_KEY', ''));
    const sid = config.get<string>('TWILIO_ACCOUNT_SID', '');
    const token = config.get<string>('TWILIO_AUTH_TOKEN', '');
    if (sid && token && !sid.startsWith('placeholder')) {
      this.twilioClient = twilio(sid, token);
    }
  }

  async sendSms(to: string, body: string) {
    if (!this.twilioClient) return; // SMS not configured in dev — silently skip
    await this.twilioClient.messages.create({
      from: this.config.get<string>('TWILIO_FROM_NUMBER', ''),
      to,
      body,
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    await sgMail.send({
      to,
      from: { email: this.config.get('SENDGRID_FROM_EMAIL', 'noreply@sapphirevibes.com.au'), name: this.config.get('SENDGRID_FROM_NAME', 'SapphireVibes') },
      subject,
      html,
    });
  }

  async sendOrderConfirmation(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: { select: { firstName: true } } },
    });
    if (!order) return;

    const html = await render(OrderConfirmationEmail({
      firstName: order.user?.firstName ?? 'Valued customer',
      orderNumber: order.orderNumber,
      items: order.items.map(i => ({ productName: i.productName, variantName: i.variantName ?? undefined, quantity: i.quantity, unitPrice: Number(i.unitPrice) })),
      subtotal: Number(order.subtotal),
      gstAmount: Number(order.gstAmount),
      shippingCost: Number(order.shippingCost),
      total: Number(order.total),
      frontendUrl: this.config.get('FRONTEND_URL', 'http://localhost:3031'),
    }));

    await this.sendEmail(order.email, `Order Confirmed · ${order.orderNumber} — SapphireVibes`, html);

    if (order.userId) {
      await this.prisma.notification.create({
        data: { userId: order.userId, type: NotificationType.ORDER_UPDATE, channel: NotificationChannel.EMAIL, title: 'Order Confirmed', body: `Your order ${order.orderNumber} has been confirmed.` },
      });
    }
  }

  async sendWelcomeEmail(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true, firstName: true, referralCode: true } });
    if (!user) return;
    const html = await render(WelcomeEmail({ firstName: user.firstName, frontendUrl: this.config.get('FRONTEND_URL', 'http://localhost:3031'), referralCode: user.referralCode }));
    await this.sendEmail(user.email, `Welcome to SapphireVibes, ${user.firstName}`, html);
  }

  async sendPasswordResetEmail(email: string, firstName: string, resetUrl: string) {
    const html = await render(PasswordResetEmail({ firstName, resetUrl }));
    await this.sendEmail(email, 'Reset your SapphireVibes password', html);
  }

  async registerBackInStockInterest(productId: string, email: string, variantId?: string) {
    // backInStockRequest model added to schema — cast until prisma generate runs
    const db = this.prisma as any;
    await db.backInStockRequest.upsert({
      where: { productId_email: { productId, email } },
      create: { productId, email, variantId },
      update: { variantId, notifiedAt: null },
    });
    return { message: 'You will be notified when this item is back in stock.' };
  }

  async notifyBackInStockCustomers(productId: string) {
    const db = this.prisma as any;
    const product = await this.prisma.product.findUnique({ where: { id: productId }, select: { name: true } });
    const requests: Array<{ id: string; email: string }> = await db.backInStockRequest.findMany({
      where: { productId, notifiedAt: null },
    });
    let sent = 0;
    for (const req of requests) {
      await this.sendEmail(
        req.email,
        `${product?.name ?? 'An item'} is back in stock — SapphireVibes`,
        `<p>Great news! <b>${product?.name ?? 'The item you wanted'}</b> is back in stock.</p>
        <p><a href="${this.config.get('FRONTEND_URL')}/products/${productId}" style="background:#c8a45c;color:#0e1116;padding:10px 20px;text-decoration:none;display:inline-block;">Shop now →</a></p>`,
      );
      await db.backInStockRequest.update({ where: { id: req.id }, data: { notifiedAt: new Date() } });
      sent++;
    }
    return { sent };
  }

  async getMyNotifications(userId: string) {
    return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async markRead(id: string, userId: string) {
    return this.prisma.notification.update({ where: { id, userId }, data: { isRead: true, readAt: new Date() } });
  }
}
