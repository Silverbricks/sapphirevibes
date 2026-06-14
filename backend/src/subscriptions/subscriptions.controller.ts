import { Controller, Get, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMy(@CurrentUser() user: { id: string }) {
    return this.subscriptionsService.getMySubscription(user.id);
  }

  @Get('my/benefits')
  @UseGuards(JwtAuthGuard)
  getBenefits(@CurrentUser() user: { id: string }) {
    return this.subscriptionsService.getBenefits(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  subscribe(@CurrentUser() user: { id: string; email: string }, @Body() body: { planId: string }) {
    return this.subscriptionsService.subscribe(user.id, body.planId, user.email);
  }

  @Patch('my/pause')
  @UseGuards(JwtAuthGuard)
  pause(@CurrentUser() user: { id: string }, @Body() body: { reason?: string }) {
    return this.subscriptionsService.pause(user.id, body.reason);
  }

  @Patch('my/resume')
  @UseGuards(JwtAuthGuard)
  resume(@CurrentUser() user: { id: string }) {
    return this.subscriptionsService.resume(user.id);
  }

  @Delete('my')
  @UseGuards(JwtAuthGuard)
  cancel(@CurrentUser() user: { id: string }) {
    return this.subscriptionsService.cancel(user.id);
  }
}
