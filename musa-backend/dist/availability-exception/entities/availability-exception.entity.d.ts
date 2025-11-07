import { Professional } from 'src/professionals/professionals.entity';
export declare class AvailabilityException {
    id: number;
    professional: Professional;
    date: string;
    startTime?: string;
    endTime?: string;
    type: string;
}
