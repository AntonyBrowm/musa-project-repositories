import { Professional } from 'src/professionals/professionals.entity';
export declare class AvailabilityRule {
    id: number;
    professional: Professional;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    active: boolean;
}
