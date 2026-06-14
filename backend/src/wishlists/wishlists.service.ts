import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistsService {
  constructor(private prisma: PrismaService) {}
  async get(userId: string) { return this.prisma.wishlistItem.findMany({ where: { userId }, include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } } }); }
  async add(userId: string, productId: string, variantId?: string) { return this.prisma.wishlistItem.upsert({ where: { userId_productId: { userId, productId } }, create: { userId, productId, variantId }, update: {} }); }
  async remove(userId: string, productId: string) { return this.prisma.wishlistItem.deleteMany({ where: { userId, productId } }); }
}
