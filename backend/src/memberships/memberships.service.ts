import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembershipsService {
  constructor(private prisma: PrismaService) {}

  async getTiers() {
    return this.prisma.membershipTier.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
  }

  async getMyMembership(userId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { userId },
      include: { tier: true },
    });
    if (!membership) throw new NotFoundException('Membership not found');

    const nextTier = await this.prisma.membershipTier.findFirst({
      where: { minSpendAud: { gt: membership.tier.minSpendAud }, isActive: true },
      orderBy: { minSpendAud: 'asc' },
    });

    return {
      ...membership,
      nextTier,
      progressToNextTier: nextTier
        ? Math.min(100, (Number(membership.annualSpendAud) / Number(nextTier.minSpendAud)) * 100)
        : 100,
    };
  }

  async recalculateTier(userId: string) {
    const membership = await this.prisma.membership.findUnique({ where: { userId } });
    if (!membership) return;

    const tiers = await this.prisma.membershipTier.findMany({
      where: { isActive: true },
      orderBy: { minSpendAud: 'desc' },
    });

    const qualifyingTier = tiers.find(
      (t) => Number(membership.annualSpendAud) >= Number(t.minSpendAud),
    );
    if (qualifyingTier && qualifyingTier.id !== membership.tierId) {
      await this.prisma.membership.update({
        where: { userId },
        data: { tierId: qualifyingTier.id, tierAssignedAt: new Date() },
      });
    }
  }

  async addSpend(userId: string, amount: number) {
    const membership = await this.prisma.membership.upsert({
      where: { userId },
      create: { userId, tierId: (await this.prisma.membershipTier.findFirst({ where: { slug: 'free' } }))!.id, totalSpendAud: amount, annualSpendAud: amount },
      update: { totalSpendAud: { increment: amount }, annualSpendAud: { increment: amount } },
    });
    await this.recalculateTier(userId);
    return membership;
  }
}
