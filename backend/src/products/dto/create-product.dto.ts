import {
  IsString, IsNumber, IsBoolean, IsOptional, IsArray, IsEnum, Min,
} from 'class-validator';
import { ProductBadge, CollectionType } from '@prisma/client';

export class CreateProductDto {
  @IsString() name: string;
  @IsString() sku: string;
  @IsString() description: string;
  @IsOptional() @IsString() shortDescription?: string;
  @IsString() categoryId: string;
  @IsNumber() @Min(0) basePrice: number;
  @IsOptional() @IsNumber() compareAtPrice?: number;
  @IsOptional() @IsNumber() costPrice?: number;
  @IsOptional() @IsBoolean() gstApplicable?: boolean;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsArray() @IsEnum(ProductBadge, { each: true }) badges?: ProductBadge[];
  @IsOptional() @IsArray() @IsEnum(CollectionType, { each: true }) collectionTypes?: CollectionType[];
  @IsOptional() @IsString() festivalType?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsNumber() weightGrams?: number;
}
