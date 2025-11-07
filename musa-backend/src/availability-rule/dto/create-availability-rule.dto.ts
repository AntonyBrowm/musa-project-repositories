export class CreateAvailabilityRuleDto {
  professionalId: number;
  dayOfWeek: number;
  startTime: string; // "09:00"
  endTime: string; // "18:00"
  active?: boolean;
}
