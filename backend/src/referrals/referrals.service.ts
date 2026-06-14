import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReferralStatus, RewardType } from '@prisma/client';

const REFERRER_REWARD_POINTS = 500;
const REFERRED_REWARD_POINTS = 200;

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async getMyReferrals(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true } });
    const referrals = await this.prisma.referral.findMany({ where: { referrerId: userId }, orderBy: { createdAt: 'desc' } });
    return { referralCode: user?.referralCode, referrals, total: referrals.length, converted: referrals.filter((r) => r.status === ReferralStatus.CONVERTED).length };
  }

  async convertReferral(referredUserId: string, orderId: string) {
    const referral = await this.prisma.referral.findUnique({ where: { referredUserId } });
    if (!referral || referral.status !== ReferralStatus.PENDING) return;

    await this.prisma.$transaction([
      // Mark referral converted
      this.prisma.referral.update({
        where: { referredUserId },
        data: { status: ReferralStatus.CONVERTED, convertedAt: new Date(), orderId },
      }),
      // Reward the referrer
      this.prisma.rewardTransaction.create({
        data: { userId: referral.referrerId, points: REFERRER_REWARD_POINTS, type: RewardType.REFERRAL, description: 'Referral reward — friend placed first order', balanceAfter: 0 },
      }),
      // Reward the referred user
      this.prisma.rewardTransaction.create({
        data: { userId: referredUserId, points: REFERRED_REWARD_POINTS, type: RewardType.REFERRAL, description: 'Welcome reward — joined via referral', balanceAfter: 0 },
      }),
    ]);
  }
}
