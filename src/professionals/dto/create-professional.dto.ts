import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ArrayUnique,
  IsInt,
  IsNumber,
} from 'class-validator';

export class CreateProfessionalDto {
  @IsString()
  name: string;

  @IsString()
  number: string;

  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  categories?: number[];

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
