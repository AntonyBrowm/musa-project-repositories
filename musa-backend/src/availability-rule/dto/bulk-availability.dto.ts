export class BulkAvailabilityDto {
  professionalId: number;
  days: number[]; // ej. [0,1,2] dayOfWeek
  startTime?: string; // "09:00" por defecto
  endTime?: string; // "18:00" por defecto
  active?: boolean; // true por defecto
}
