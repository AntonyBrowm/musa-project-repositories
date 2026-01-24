import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class CreateAvailabilityRuleDto {
  @IsInt()
  professionalId: number;

  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  dayOfWeek: number;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  startTime: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  endTime: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

