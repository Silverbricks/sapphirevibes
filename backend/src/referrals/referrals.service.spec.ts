import { Test } from '@nestjs/testing';
import { ReferralsService } from './referrals.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReferralStatus, RewardType } from '@prisma/client';

const mockPrisma = {
  user: { findUnique: jest.fn() },
  referral: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
  rewardTransaction: { create: jest.fn() },
  $transaction: jest.fn((fns: any[]) => Promise.all(fns)),
};

describe('ReferralsService', () => {
  let service: ReferralsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        ReferralsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get(ReferralsService);
  });

  describe('convertReferral', () => {
    it('does nothing when no referral found', async () => {
      mockPrisma.referral.findUnique.mockResolvedValue(null);
      await service.convertReferral('user1', 'order1');
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('does nothing when referral already converted', async () => {
      mockPrisma.referral.findUnique.mockResolvedValue({ status: ReferralStatus.CONVERTED, referrerId: 'ref1' });
      await service.convertReferral('user1', 'order1');
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('converts pending referral and creates reward transactions', async () => {
      mockPrisma.referral.findUnique.mockResolvedValue({ referredUserId: 'user1', referrerId: 'ref1', status: ReferralStatus.PENDING });
      mockPrisma.referral.update.mockResolvedValue({});
      mockPrisma.rewardTransaction.create.mockResolvedValue({});
      await service.convertReferral('user1', 'order1');
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });
});
