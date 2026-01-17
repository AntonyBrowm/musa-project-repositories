import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  durationMin: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsNumber()
  categoryId: number;
}
