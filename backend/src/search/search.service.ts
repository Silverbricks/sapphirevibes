import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { REDIS_CLIENT } from '../redis/redis.module';
import Redis from 'ioredis';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService, @Inject(REDIS_CLIENT) private redis: Redis) {}

  async search(q: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, results] = await Promise.all([
      this.prisma.product.count({ where: { isActive: true, deletedAt: null, OR: [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } }),
      this.prisma.product.findMany({ where: { isActive: true, deletedAt: null, OR: [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] }, skip, take: limit, include: { images: { where: { isPrimary: true }, take: 1 }, category: { select: { name: true, slug: true } } } }),
    ]);
    return { results, total, page, limit };
  }

  async suggestions(q: string) {
    const key = `search:suggest:${q.toLowerCase()}`;
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached);

    const products = await this.prisma.product.findMany({ where: { name: { startsWith: q, mode: 'insensitive' }, isActive: true }, select: { name: true, slug: true }, take: 8 });
    await this.redis.setex(key, 300, JSON.stringify(products));
    return products;
  }
}
