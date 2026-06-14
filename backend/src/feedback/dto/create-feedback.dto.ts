import { IsInt, IsOptional, IsString, IsArray, Max, Min, MaxLength } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  targetId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}
