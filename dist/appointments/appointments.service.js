"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AppointmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointments_entity_1 = require("./appointments.entity");
const services_entity_1 = require("../services/services.entity");
const professionals_entity_1 = require("../professionals/professionals.entity");
const availability_rule_entity_1 = require("../availability-rule/entities/availability-rule.entity");
const availability_exception_entity_1 = require("../availability-exception/entities/availability-exception.entity");
const ics_1 = require("ics");
const nodemailer = __importStar(require("nodemailer"));
let AppointmentsService = AppointmentsService_1 = class AppointmentsService {
    appointmentRepo;
    serviceRepo;
    professionalRepo;
    ruleRepo;
    exceptionRepo;
    logger = new common_1.Logger(AppointmentsService_1.name);
    transporter;
    constructor(appointmentRepo, serviceRepo, professionalRepo, ruleRepo, exceptionRepo) {
        this.appointmentRepo = appointmentRepo;
        this.serviceRepo = serviceRepo;
        this.professionalRepo = professionalRepo;
        this.ruleRepo = ruleRepo;
        this.exceptionRepo = exceptionRepo;
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async isSlotAvailable(professionalId, startAt, endAt, excludingAppointmentId) {
        const dayOfWeek = startAt.getUTCDay();
        const timeString = (d) => `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
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
        const coveredByRule = rules.some((r) => {
            const ruleStart = r.startTime.slice(0, 5);
            const ruleEnd = r.endTime.slice(0, 5);
            return ruleStart <= startTime && ruleEnd >= endTime;
        });
        if (!coveredByRule)
            return { ok: false, reason: 'Horario fuera de la regla de trabajo' };
        const dateOnly = startAt.toISOString().slice(0, 10);
        const exceptions = await this.exceptionRepo.find({
            where: { professional: { id: professionalId }, date: dateOnly },
        });
        for (const ex of exceptions) {
            if (!ex.startTime && !ex.endTime)
                return { ok: false, reason: 'Día marcado como no laboral' };
            if (ex.startTime && ex.endTime) {
                const exStart = new Date(`${dateOnly}T${ex.startTime}:00.000Z`);
                const exEnd = new Date(`${dateOnly}T${ex.endTime}:00.000Z`);
                if (exStart < endAt && exEnd > startAt)
                    return { ok: false, reason: 'Horario bloqueado por excepción' };
            }
        }
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
    async create(dto) {
        const service = await this.serviceRepo.findOne({
            where: { id: dto.serviceId },
        });
        if (!service)
            throw new common_1.BadRequestException('Servicio no encontrado');
        let professional;
        if (dto.professionalId) {
            const found = await this.professionalRepo.findOne({
                where: { id: dto.professionalId },
            });
            if (!found)
                throw new common_1.BadRequestException('Profesional no encontrado');
            professional = found;
        }
        else {
            throw new common_1.BadRequestException('Debe especificar profesional');
        }
        const startAt = new Date(dto.startAt);
        const endAt = new Date(startAt.getTime() + service.durationMin * 60000);
        const availability = await this.isSlotAvailable(professional.id, startAt, endAt);
        if (!availability.ok)
            throw new common_1.BadRequestException(availability.reason || 'Horario no disponible');
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
        const fullAppointment = await this.findOne(savedAppointment.id);
        if (fullAppointment.professional?.email) {
            this.sendCalendarInvitation(fullAppointment).catch((err) => this.logger.error(`Error al enviar invitación por correo: ${err.message}`));
        }
        return savedAppointment;
    }
    async findAll() {
        return this.appointmentRepo.find({
            relations: ['service', 'professional'],
            order: { startAt: 'ASC' },
        });
    }
    async findOne(id) {
        const appointment = await this.appointmentRepo.findOne({
            where: { id },
            relations: ['service', 'professional'],
        });
        if (!appointment)
            throw new Error('Cita no encontrada');
        return appointment;
    }
    async getCalendar(date) {
        const start = new Date(date + 'T00:00:00.000Z');
        const end = new Date(date + 'T23:59:59.999Z');
        return this.appointmentRepo.find({
            where: { startAt: (0, typeorm_2.Between)(start, end), status: 'scheduled' },
            relations: ['service', 'professional'],
            order: { startAt: 'ASC' },
        });
    }
    async remove(id) {
        const appointment = await this.appointmentRepo.findOne({ where: { id } });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with id ${id} not found`);
        }
        await this.appointmentRepo.remove(appointment);
    }
    async update(id, dto) {
        const appointment = await this.appointmentRepo.findOne({ where: { id } });
        if (!appointment)
            throw new common_1.NotFoundException(`Appointment with id ${id} not found`);
        const newStart = dto.startAt ? new Date(dto.startAt) : appointment.startAt;
        const newEnd = dto.endAt ? new Date(dto.endAt) : appointment.endAt;
        const newProfessionalId = dto.professionalId ?? appointment.professionalId;
        const slot = await this.isSlotAvailable(newProfessionalId, newStart, newEnd, id);
        if (!slot.ok) {
            throw new common_1.BadRequestException(slot.reason || 'Horario no disponible');
        }
        await this.appointmentRepo.update(id, {
            ...dto,
        });
        const updated = await this.appointmentRepo.findOneBy({ id });
        if (!updated)
            throw new common_1.NotFoundException(`Appointment with id ${id} not found after update`);
        return updated;
    }
    generateSingleIcs(app) {
        const start = new Date(app.startAt);
        const end = new Date(app.endAt);
        const event = {
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
            method: 'REQUEST',
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
            (0, ics_1.createEvent)(event, (error, value) => {
                if (error)
                    return reject(error);
                resolve(value);
            });
        });
    }
    async sendCalendarInvitation(app) {
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
    async getIcsFeed(professionalId) {
        const appointments = await this.appointmentRepo.find({
            where: {
                professionalId,
                status: 'scheduled',
            },
            relations: ['service', 'professional'],
            order: { startAt: 'ASC' },
        });
        const events = appointments.map((app) => {
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
            (0, ics_1.createEvents)(events, (error, value) => {
                if (error)
                    return reject(error);
                resolve(value);
            });
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = AppointmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointments_entity_1.Appointment)),
    __param(1, (0, typeorm_1.InjectRepository)(services_entity_1.Service)),
    __param(2, (0, typeorm_1.InjectRepository)(professionals_entity_1.Professional)),
    __param(3, (0, typeorm_1.InjectRepository)(availability_rule_entity_1.AvailabilityRule)),
    __param(4, (0, typeorm_1.InjectRepository)(availability_exception_entity_1.AvailabilityException)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map