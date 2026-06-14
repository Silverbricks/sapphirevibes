import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RewardType } from '@prisma/client';

const POINTS_PER_DOLLAR = 1;
const POINTS_TO_DOLLAR = 100; // 100 points = $1

@Injectable()
export class RewardsService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string): Promise<number> {
    const latest = await this.prisma.rewardTransaction.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return latest?.balanceAfter ?? 0;
  }

  async getHistory(userId: string) {
    return this.prisma.rewardTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async earn(userId: string, amount: number, orderId?: string, type = RewardType.EARNED, multiplier = 1.0) {
    const points = Math.floor(amount * POINTS_PER_DOLLAR * multiplier);
    if (points <= 0) return;

    const balance = await this.getBalance(userId);
    return this.prisma.rewardTransaction.create({
      data: {
        userId, orderId, type, points,
        balanceAfter: balance + points,
        description: `Earned ${points} points for order`,
      },
    });
  }

  async redeem(userId: string, points: number) {
    const balance = await this.getBalance(userId);
    if (balance < points) throw new BadRequestException('Insufficient reward points');

    const dollarValue = points / POINTS_TO_DOLLAR;
    await this.prisma.rewardTransaction.create({
      data: {
        userId, type: RewardType.REDEEMED, points: -points,
        balanceAfter: balance - points,
        description: `Redeemed ${points} points for $${dollarValue.toFixed(2)} discount`,
      },
    });
    return { dollarValue };
  }

  async awardBirthdayGift(userId: string) {
    const points = 500;
    const balance = await this.getBalance(userId);
    return this.prisma.rewardTransaction.create({
      data: {
        userId, type: RewardType.BIRTHDAY_GIFT, points,
        balanceAfter: balance + points,
        description: 'Happy Birthday! 500 bonus points',
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
    });
  }
}
