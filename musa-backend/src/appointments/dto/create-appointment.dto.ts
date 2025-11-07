import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  IsDateString,
  IsEnum,
  IsNumber,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  clientName: string;

  @IsOptional()
  @IsEmail()
  clientEmail?: string;

  @IsString()
  clientNumber: string;

  @IsInt()
  serviceId: number;

  @IsOptional()
  @IsInt()
  professionalId?: number;

  @IsDateString()
  startAt: string; // ISO string (ej: 2025-09-25T14:00:00Z)

  @IsDateString()
  endAt: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNumber()
  totalCost: number;

  @IsEnum(['client', 'admin'])
  createdBy: 'client' | 'admin';
}
