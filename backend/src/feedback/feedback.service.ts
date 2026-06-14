import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { getPaginationParams, paginate } from '../common/utils/pagination.helper';

const ALLOWED_CATEGORIES = ['quality', 'service', 'value', 'experience'];

/** Strip HTML tags to prevent XSS in stored comments */
function sanitize(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFeedbackDto, userId?: string) {
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const safeComment = dto.comment ? sanitize(dto.comment) : undefined;
    if (safeComment && safeComment.length > 500) {
      throw new BadRequestException('Comment must be 500 characters or fewer');
    }

    const validCategories = (dto.categories ?? []).filter(c =>
      ALLOWED_CATEGORIES.includes(c.toLowerCase()),
    );

    // Use `as any` until prisma generate is run after migration
    return (this.prisma as any).feedback.create({
      data: {
        targetId: dto.targetId,
        userId: userId ?? null,
        rating: dto.rating,
        comment: safeComment ?? null,
        categories: validCategories,
      },
    });
  }

  async list(targetId: string, page = 1, sort: 'newest' | 'highest' | 'lowest' = 'newest') {
    const { skip, take } = getPaginationParams(page, 20);
    const db = this.prisma as any;

    const orderBy =
      sort === 'highest' ? { rating: 'desc' } :
      sort === 'lowest'  ? { rating: 'asc' } :
                           { createdAt: 'desc' };

    const [total, data] = await Promise.all([
      db.feedback.count({ where: { targetId, status: 'VISIBLE' } }),
      db.feedback.findMany({
        where: { targetId, status: 'VISIBLE' },
        orderBy,
        skip,
        take,
        select: {
          id: true,
          rating: true,
          comment: true,
          categories: true,
          createdAt: true,
          userId: true,
        },
      }),
    ]);

    return paginate(data, total, page, take);
  }

  async getSummary(targetId: string) {
    const db = this.prisma as any;
    const all: Array<{ rating: number }> = await db.feedback.findMany({
      where: { targetId, status: 'VISIBLE' },
      select: { rating: true },
    });

    const count = all.length;
    if (count === 0) return { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>;
    let sum = 0;
    for (const fb of all) {
      sum += fb.rating;
      distribution[fb.rating] = (distribution[fb.rating] ?? 0) + 1;
    }

    return {
      average: Math.round((sum / count) * 10) / 10,
      count,
      distribution,
    };
  }

  async updateStatus(id: string, status: 'VISIBLE' | 'HIDDEN' | 'FLAGGED') {
    const db = this.prisma as any;
    const existing = await db.feedback.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Feedback not found');
    return db.feedback.update({ where: { id }, data: { status } });
  }
}
