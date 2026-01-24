import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsArray,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class BulkAvailabilityDto {
  @IsInt()
  professionalId: number;

  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  days: number[];

  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/)
  startTime?: string;

  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/)
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
