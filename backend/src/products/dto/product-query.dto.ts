import { IsOptional, IsString, IsNumber, IsEnum, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProductBadge, CollectionType } from '@prisma/client';

export class ProductQueryDto {
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(ProductBadge) badge?: ProductBadge;
  @IsOptional() @IsEnum(CollectionType) collection?: CollectionType;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() material?: string;
  @IsOptional() @IsString() room?: string;
  @IsOptional() @IsString() style?: string;
  @IsOptional() @Type(() => Number) @IsNumber() minPrice?: number;
  @IsOptional() @Type(() => Number) @IsNumber() maxPrice?: number;
  @IsOptional() @IsString() sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  @IsOptional() @Type(() => Number) @IsNumber() page?: number;
  @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
}
