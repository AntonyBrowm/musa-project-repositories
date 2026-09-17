import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from './appointments.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Service } from '../services/services.entity';
import { Professional } from '../professionals/professionals.entity';
import { AvailabilityRule } from 'src/availability-rule/entities/availability-rule.entity';
import { AvailabilityException } from 'src/availability-exception/entities/availability-exception.entity';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { createEvents, createEvent, EventAttributes } from 'ics';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);
  private transporter: nodemailer.Transporter;
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Professional)
    private readonly professionalRepo: Repository<Professional>,
    @InjectRepository(AvailabilityRule)
    private readonly ruleRepo: Repository<AvailabilityRule>,
    @InjectRepository(AvailabilityException)
    private readonly exceptionRepo: Repository<AvailabilityException>,
  ) {
this.transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // Auto-detecta si es 465 o 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
  }

  // función central: valida reglas, excepciones y overlaps
  private async isSlotAvailable(
    professionalId: number,
    startAt: Date,
    endAt: Date,
    excludingAppointmentId?: number, // <-- nuevo parámetro opcional
  ): Promise<{ ok: boolean; reason?: string }> {
    // 1) Reglas recurrentes
    const dayOfWeek = startAt.getUTCDay(); // usa UTC-consistent como ya hacías
    const timeString = (d: Date) =>
      `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;

    const startTime = timeString(startAt);
    const endTime = timeString(endAt);

    const rules = await this.ruleRepo.find({
      where: { professional: { id: professionalId }, dayOfWeek, active: true },
    });

    if (!rules || rules.length === 0) {
      return {
        ok: false,
        reason: 'No hay reglas de disponibilidad para ese día',
      };
    }

    // Verificar que alguna regla cubra completamente el rango solicitado
    const coveredByRule = rules.some((r) => {
      const ruleStart = r.startTime.slice(0, 5);
      const ruleEnd = r.endTime.slice(0, 5);
      return ruleStart <= startTime && ruleEnd >= endTime;
    });

    if (!coveredByRule)
      return { ok: false, reason: 'Horario fuera de la regla de trabajo' };

    // 2) Excepciones en la fecha
    const dateOnly = startAt.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const exceptions = await this.exceptionRepo.find({
      where: { professional: { id: professionalId }, date: dateOnly },
    });

    for (const ex of exceptions) {
      if (!ex.startTime && !ex.endTime)
        return { ok: false, reason: 'Día marcado como no laboral' };

      if (ex.startTime && ex.endTime) {
        // construimos en UTC (tu ex.startTime/endTime están tipo "HH:mm")
        const exStart = new Date(`${dateOnly}T${ex.startTime}:00.000Z`);
        const exEnd = new Date(`${dateOnly}T${ex.endTime}:00.000Z`);
        if (exStart < endAt && exEnd > startAt)
          return { ok: false, reason: 'Horario bloqueado por excepción' };
      }
    }

    // 3) Overlap con otras appointments (solo scheduled)
    const qb = this.appointmentRepo
      .createQueryBuilder('a')
      .leftJoin('a.professional', 'p')
      .where('p.id = :professionalId', { professionalId })
      .andWhere('a.status = :status', { status: 'scheduled' })
      .andWhere('a.startAt < :endAt', { endAt: endAt.toISOString() })
      .andWhere('a.endAt > :startAt', { startAt: startAt.toISOString() });

    if (excludingAppointmentId) {
      qb.andWhere('a.id != :excludingId', {
        excludingId: excludingAppointmentId,
      });
    }

    const overlapping = await qb.getOne();

    if (overlapping)
      return { ok: false, reason: 'Ya existe una cita en ese horario' };

    return { ok: true };
  }

async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const service = await this.serviceRepo.findOne({
      where: { id: dto.serviceId },
    });
    if (!service) throw new BadRequestException('Servicio no encontrado');

    let professional: Professional | undefined;
    if (dto.professionalId) {
      const found = await this.professionalRepo.findOne({
        where: { id: dto.professionalId },
      });
      if (!found) throw new BadRequestException('Profesional no encontrado');
      professional = found;
    } else {
      throw new BadRequestException('Debe especificar profesional');
    }

    const startAt = new Date(dto.startAt);
    const endAt = new Date(startAt.getTime() + service.durationMin * 60000);

    const availability = await this.isSlotAvailable(
      professional.id,
      startAt,
      endAt,
    );
    if (!availability.ok)
      throw new BadRequestException(availability.reason || 'Horario no disponible');

    const appointment = this.appointmentRepo.create({
      clientName: dto.clientName,
      clientEmail: dto.clientEmail,
      clientNumber: dto.clientNumber,
      serviceId: dto.serviceId,
      professionalId: dto.professionalId,
      startAt,
      endAt,
      note: dto.note,
      totalCost: dto.totalCost,
      createdBy: dto.createdBy,
    });

    const savedAppointment = await this.appointmentRepo.save(appointment);

    // Cargar relaciones completas para construir el correo
    const fullAppointment = await this.findOne(savedAppointment.id);

    // Si el profesional tiene correo asignado, enviamos la invitación por email
    if (fullAppointment.professional?.email) {
      this.sendCalendarInvitation(fullAppointment).catch((err) =>
        this.logger.error(`Error al enviar invitación por correo: ${err.message}`),
      );
    }

    return savedAppointment;
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      relations: ['service', 'professional'],
      order: { startAt: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['service', 'professional'],
    });
    if (!appointment) throw new Error('Cita no encontrada');
    return appointment;
  }

  async getCalendar(date: string): Promise<Appointment[]> {
    const start = new Date(date + 'T00:00:00.000Z');
    const end = new Date(date + 'T23:59:59.999Z');

    return this.appointmentRepo.find({
      where: { startAt: Between(start, end), status: 'scheduled' },
      relations: ['service', 'professional'],
      order: { startAt: 'ASC' },
    });
  }
  
  async remove(id: number): Promise<void> {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    await this.appointmentRepo.remove(appointment);
  }

  async update(id: number, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (!appointment)
      throw new NotFoundException(`Appointment with id ${id} not found`);

    const newStart = dto.startAt ? new Date(dto.startAt) : appointment.startAt;
    const newEnd = dto.endAt ? new Date(dto.endAt) : appointment.endAt;
    const newProfessionalId = dto.professionalId ?? appointment.professionalId;

    // validar disponibilidad EXCLUYENDO la cita actual
    const slot = await this.isSlotAvailable(
      newProfessionalId,
      newStart,
      newEnd,
      id,
    );
    if (!slot.ok) {
      throw new BadRequestException(slot.reason || 'Horario no disponible');
    }

    // si todo ok, actualizamos
    await this.appointmentRepo.update(id, {
      ...dto,
    });

    const updated = await this.appointmentRepo.findOneBy({ id });
    if (!updated)
      throw new NotFoundException(
        `Appointment with id ${id} not found after update`,
      );

    return updated;
  }
  private generateSingleIcs(app: Appointment): Promise<string> {
    const start = new Date(app.startAt);
    const end = new Date(app.endAt);

    const event: EventAttributes = {
      start: [
        start.getUTCFullYear(),
        start.getUTCMonth() + 1,
        start.getUTCDate(),
        start.getUTCHours(),
        start.getUTCMinutes(),
      ],
      end: [
        end.getUTCFullYear(),
        end.getUTCMonth() + 1,
        end.getUTCDate(),
        end.getUTCHours(),
        end.getUTCMinutes(),
      ],
      title: `Nueva Cita: ${app.clientName} - ${app.service?.name || 'Servicio'}`,
      description: `Cliente: ${app.clientName}\nTeléfono: ${app.clientNumber}\nNota: ${app.note || 'Sin notas'}`,
      location: 'Salón Musa',
      status: 'CONFIRMED',
      method: 'REQUEST', // INDISPENSABLE para que Google/Apple lean el correo como invitación activa
      organizer: { name: 'Musa App', email: process.env.SMTP_USER || 'no-reply@musa.com' },
      attendees: [
        {
          name: app.professional.name || 'Profesional',
          email: app.professional.email,
          rsvp: true,
          partstat: 'NEEDS-ACTION',
          role: 'REQ-PARTICIPANT',
        },
      ],
    };

    return new Promise((resolve, reject) => {
      createEvent(event, (error, value) => {
        if (error) return reject(error);
        resolve(value);
      });
    });
  }
  private async sendCalendarInvitation(app: Appointment): Promise<void> {
    const icsContent = await this.generateSingleIcs(app);

    const mailOptions = {
      from: `"Musa App" <${process.env.SMTP_USER || 'no-reply@musa.com'}>`,
      to: app.professional.email,
      subject: `Nueva cita reservada: ${app.clientName} - ${app.service?.name}`,
      text: `Hola ${app.professional.name || ''},\n\nSe ha agendado una nueva cita con ${app.clientName}.\nFecha: ${app.startAt.toISOString()}\nServicio: ${app.service?.name}\nTeléfono del cliente: ${app.clientNumber}\n\nSe adjunta la invitación para agendarlo a tu calendario.`,
      icalEvent: {
        filename: 'cita-invitacion.ics',
        method: 'REQUEST',
        content: icsContent,
      },
    };

    await this.transporter.sendMail(mailOptions);
    this.logger.log(`Invitación enviada exitosamente a ${app.professional.email}`);
  }
  async getIcsFeed(professionalId: number): Promise<string> {
  const appointments = await this.appointmentRepo.find({
    where: {
      professionalId,
      status: 'scheduled',
    },
    relations: ['service', 'professional'],
    order: { startAt: 'ASC' },
  });

  const events: EventAttributes[] = appointments.map((app) => {
    const start = new Date(app.startAt);
    const end = new Date(app.endAt);

    return {
      start: [
        start.getUTCFullYear(),
        start.getUTCMonth() + 1,
        start.getUTCDate(),
        start.getUTCHours(),
        start.getUTCMinutes(),
      ],
      end: [
        end.getUTCFullYear(),
        end.getUTCMonth() + 1,
        end.getUTCDate(),
        end.getUTCHours(),
        end.getUTCMinutes(),
      ],
      title: `Cita: ${app.clientName} - ${app.service?.name || 'Servicio'}`,
      description: `Cliente: ${app.clientName}\nTeléfono: ${app.clientNumber}\nNota: ${app.note || 'Sin nota'}`,
      location: 'Salón Musa',
      status: 'CONFIRMED',
    };
  });

  return new Promise((resolve, reject) => {
    createEvents(events, (error, value) => {
      if (error) return reject(error);
      resolve(value);
    });
  });
}
}
