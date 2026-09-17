import express from 'express';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './appointments.entity';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(dto: CreateAppointmentDto): Promise<Appointment>;
    findAll(): Promise<Appointment[]>;
    getCalendar(date: any): Promise<Appointment[]>;
    update(id: number, dto: UpdateAppointmentDto): Promise<Appointment>;
    findOne(id: number): Promise<Appointment>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
    getFeed(professionalId: number, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
}
