import { Controller, Post, Body, Headers, RawBodyRequest, Req, UseGuards, HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('intent')
  @UseGuards(JwtAuthGuard)
  createIntent(
    @Body() body: { amount: number; currency?: string },
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.paymentsService.createPaymentIntent(body.amount, body.currency, { userId: user.id });
  }

  @Post('webhooks/stripe')
  @HttpCode(200)
  stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleStripeWebhook(req.rawBody!, signature);
  }
}
