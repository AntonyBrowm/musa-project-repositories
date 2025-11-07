"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const typeorm_1 = require("typeorm");
const services_entity_1 = require("../services/services.entity");
const professionals_entity_1 = require("../professionals/professionals.entity");
let Appointment = class Appointment {
    id;
    clientName;
    clientEmail;
    clientNumber;
    service;
    serviceId;
    professional;
    professionalId;
    startAt;
    endAt;
    note;
    totalCost;
    status;
    createdBy;
    createdAt;
};
exports.Appointment = Appointment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Appointment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'client_name' }),
    __metadata("design:type", String)
], Appointment.prototype, "clientName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'client_email', nullable: true }),
    __metadata("design:type", String)
], Appointment.prototype, "clientEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'client_number', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Appointment.prototype, "clientNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => services_entity_1.Service, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'service_id' }),
    __metadata("design:type", services_entity_1.Service)
], Appointment.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service_id' }),
    __metadata("design:type", Number)
], Appointment.prototype, "serviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => professionals_entity_1.Professional, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'professional_id' }),
    __metadata("design:type", professionals_entity_1.Professional)
], Appointment.prototype, "professional", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'professional_id' }),
    __metadata("design:type", Number)
], Appointment.prototype, "professionalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Appointment.prototype, "startAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Appointment.prototype, "endAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Appointment.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Appointment.prototype, "totalCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'scheduled' }),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'client' }),
    __metadata("design:type", String)
], Appointment.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Appointment.prototype, "createdAt", void 0);
exports.Appointment = Appointment = __decorate([
    (0, typeorm_1.Entity)('appointments')
], Appointment);
//# sourceMappingURL=appointments.entity.js.map