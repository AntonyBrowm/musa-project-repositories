export class CreateAvailabilityExceptionDto {
  professionalId: number;
  date: string; // "YYYY-MM-DD"
  startTime?: string;
  endTime?: string;
  type?: string;
}
