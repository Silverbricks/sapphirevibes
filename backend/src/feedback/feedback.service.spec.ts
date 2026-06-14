import { Test } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockFeedbackRepo = {
  create: jest.fn(),
  findMany: jest.fn(),
  count: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
};

const mockPrisma = {};
// Attach as any to simulate pending prisma generate
Object.assign(mockPrisma, { feedback: mockFeedbackRepo });

describe('FeedbackService', () => {
  let service: FeedbackService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        FeedbackService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get(FeedbackService);
  });

  describe('create', () => {
    it('throws BadRequestException when rating < 1', async () => {
      await expect(service.create({ targetId: 't1', rating: 0, comment: 'ok', categories: [] })).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when rating > 5', async () => {
      await expect(service.create({ targetId: 't1', rating: 6, comment: 'ok', categories: [] })).rejects.toThrow(BadRequestException);
    });

    it('strips HTML from comment before saving', async () => {
      mockFeedbackRepo.create.mockResolvedValue({ id: 'f1' });
      await service.create({ targetId: 't1', rating: 4, comment: '<b>Great</b> product!', categories: [] });
      expect(mockFeedbackRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ comment: 'Great product!' }) }),
      );
    });

    it('filters out invalid categories', async () => {
      mockFeedbackRepo.create.mockResolvedValue({ id: 'f1' });
      await service.create({ targetId: 't1', rating: 5, comment: 'Nice', categories: ['quality', 'invalid', 'service'] });
      expect(mockFeedbackRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ categories: ['quality', 'service'] }) }),
      );
    });
  });

  describe('getSummary', () => {
    it('returns zeros when no feedback exists', async () => {
      mockFeedbackRepo.findMany.mockResolvedValue([]);
      const result = await service.getSummary('t1');
      expect(result).toEqual({ average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
    });

    it('computes correct average and distribution', async () => {
      mockFeedbackRepo.findMany.mockResolvedValue([{ rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 3 }]);
      const result = await service.getSummary('t1');
      expect(result.count).toBe(4);
      expect(result.average).toBe(4.3); // (5+4+5+3)/4 = 17/4 = 4.25 → rounded to 1dp = 4.3
      expect(result.distribution[5]).toBe(2);
      expect(result.distribution[4]).toBe(1);
      expect(result.distribution[3]).toBe(1);
    });
  });

  describe('updateStatus', () => {
    it('throws NotFoundException when feedback does not exist', async () => {
      mockFeedbackRepo.findUnique.mockResolvedValue(null);
      await expect(service.updateStatus('nonexistent', 'HIDDEN')).rejects.toThrow(NotFoundException);
    });

    it('updates status when feedback exists', async () => {
      mockFeedbackRepo.findUnique.mockResolvedValue({ id: 'f1' });
      mockFeedbackRepo.update.mockResolvedValue({ id: 'f1', status: 'HIDDEN' });
      const result = await service.updateStatus('f1', 'HIDDEN');
      expect(result.status).toBe('HIDDEN');
    });
  });
});
