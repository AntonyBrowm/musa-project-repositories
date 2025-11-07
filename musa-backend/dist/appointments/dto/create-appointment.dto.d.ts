export declare class CreateAppointmentDto {
    clientName: string;
    clientEmail?: string;
    clientNumber: string;
    serviceId: number;
    professionalId?: number;
    startAt: string;
    endAt: string;
    note?: string;
    totalCost: number;
    createdBy: 'client' | 'admin';
}
