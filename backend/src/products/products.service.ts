import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CollectionType, Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { paginate, getPaginationParams } from '../common/utils/pagination.helper';
import slugify from 'slugify';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const { skip, take } = getPaginationParams(query.page, query.limit ?? 20);

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      deletedAt: null,
      ...(query.category && { category: { slug: query.category } }),
      ...(query.badge && { badges: { has: query.badge } }),
      ...(query.collection && { collectionTypes: { has: query.collection } }),
      ...(query.minPrice && { basePrice: { gte: query.minPrice } }),
      ...(query.maxPrice && { basePrice: { lte: query.maxPrice } }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
          { tags: { has: query.search.toLowerCase() } },
        ],
      }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      query.sort === 'price_asc' ? { basePrice: 'asc' }
      : query.sort === 'price_desc' ? { basePrice: 'desc' }
      : { createdAt: 'desc' };

    const [total, data] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: { select: { name: true, slug: true } },
          images: { where: { isPrimary: true }, take: 1 },
          variants: { where: { isDefault: true }, take: 1 },
        },
      }),
    ]);

    return paginate(data, total, query.page ?? 1, take);
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, isActive: true, deletedAt: null },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { include: { inventory: true }, orderBy: { sortOrder: 'asc' } },
        reviews: {
          where: { isApproved: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findFeatured() {
    return this.prisma.product.findMany({
      where: { isFeatured: true, isActive: true, deletedAt: null },
      take: 8,
      orderBy: { updatedAt: 'desc' },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: { where: { isDefault: true }, take: 1, include: { inventory: true } },
      },
    });
  }

  async findByCollection(collection: CollectionType) {
    return this.prisma.product.findMany({
      where: { collectionTypes: { has: collection }, isActive: true, deletedAt: null },
      take: 12,
      orderBy: { updatedAt: 'desc' },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: { where: { isDefault: true }, take: 1, include: { inventory: true } },
      },
    });
  }

  async findByFestivalType(festivalType: string) {
    return this.prisma.product.findMany({
      where: { festivalType, isActive: true, deletedAt: null },
      take: 20,
      orderBy: { updatedAt: 'desc' },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: { where: { isDefault: true }, take: 1, include: { inventory: true } },
      },
    });
  }

  async create(dto: CreateProductDto) {
    const slug = slugify(dto.name, { lower: true, strict: true });
    return this.prisma.product.create({
      data: { ...dto, slug, basePrice: dto.basePrice, gstRate: dto.gstApplicable !== false ? 10 : 0 },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.ensureExists(id);
    const data: Prisma.ProductUpdateInput = { ...dto };
    if (dto.name) data.slug = slugify(dto.name, { lower: true, strict: true });
    return this.prisma.product.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    await this.ensureExists(id);
    return this.prisma.product.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
  }

  async getImageUploadUrls(productId: string, count: number) {
    // Returns pre-signed S3 URLs — actual S3 integration in S3Service
    return Array.from({ length: count }, (_, i) => ({
      uploadUrl: `https://s3.placeholder/${productId}/image-${i}.jpg`,
      publicUrl: `https://cdn.sapphirevibes.com.au/products/${productId}/image-${i}.jpg`,
    }));
  }

  private async ensureExists(id: string) {
    const product = await this.prisma.product.findFirst({ where: { id, deletedAt: null } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
