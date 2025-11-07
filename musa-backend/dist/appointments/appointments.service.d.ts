import { Repository } from 'typeorm';
import { Appointment } from './appointments.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Service } from '../services/services.entity';
import { Professional } from '../professionals/professionals.entity';
import { AvailabilityRule } from 'src/availability-rule/entities/availability-rule.entity';
import { AvailabilityException } from 'src/availability-exception/entities/availability-exception.entity';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsService {
    private readonly appointmentRepo;
    private readonly serviceRepo;
    private readonly professionalRepo;
    private readonly ruleRepo;
    private readonly exceptionRepo;
    constructor(appointmentRepo: Repository<Appointment>, serviceRepo: Repository<Service>, professionalRepo: Repository<Professional>, ruleRepo: Repository<AvailabilityRule>, exceptionRepo: Repository<AvailabilityException>);
    private isSlotAvailable;
    create(dto: CreateAppointmentDto): Promise<Appointment>;
    findAll(): Promise<Appointment[]>;
    findOne(id: number): Promise<Appointment>;
    getCalendar(date: string): Promise<Appointment[]>;
    remove(id: number): Promise<void>;
    update(id: number, dto: UpdateAppointmentDto): Promise<Appointment>;
}
