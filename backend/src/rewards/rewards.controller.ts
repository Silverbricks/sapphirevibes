import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('memberships/my/rewards')
@UseGuards(JwtAuthGuard)
export class RewardsController {
  constructor(private rewardsService: RewardsService) {}

  @Get()
  getBalance(@CurrentUser() user: { id: string }) {
    return this.rewardsService.getBalance(user.id).then((balance) => ({ balance }));
  }

  @Get('history')
  getHistory(@CurrentUser() user: { id: string }) {
    return this.rewardsService.getHistory(user.id);
  }

  @Post('redeem')
  redeem(@CurrentUser() user: { id: string }, @Body() body: { points: number }) {
    return this.rewardsService.redeem(user.id, body.points);
  }
}
