import { Service } from '../services/services.entity';
import { Professional } from '../professionals/professionals.entity';
export declare class Appointment {
    id: number;
    clientName: string;
    clientEmail?: string;
    clientNumber: string;
    service: Service;
    serviceId: number;
    professional: Professional;
    professionalId: number;
    startAt: Date;
    endAt: Date;
    note?: string;
    totalCost: number;
    status: 'scheduled' | 'completed' | 'cancelled';
    createdBy: string;
    createdAt: Date;
}
