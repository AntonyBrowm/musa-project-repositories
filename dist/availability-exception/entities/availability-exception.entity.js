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
exports.AvailabilityException = void 0;
const professionals_entity_1 = require("../../professionals/professionals.entity");
const typeorm_1 = require("typeorm");
let AvailabilityException = class AvailabilityException {
    id;
    professional;
    date;
    startTime;
    endTime;
    type;
};
exports.AvailabilityException = AvailabilityException;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AvailabilityException.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => professionals_entity_1.Professional, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'professional_id' }),
    __metadata("design:type", professionals_entity_1.Professional)
], AvailabilityException.prototype, "professional", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], AvailabilityException.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time', type: 'time', nullable: true }),
    __metadata("design:type", String)
], AvailabilityException.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', type: 'time', nullable: true }),
    __metadata("design:type", String)
], AvailabilityException.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'custom' }),
    __metadata("design:type", String)
], AvailabilityException.prototype, "type", void 0);
exports.AvailabilityException = AvailabilityException = __decorate([
    (0, typeorm_1.Entity)('availability_exceptions')
], AvailabilityException);
//# sourceMappingURL=availability-exception.entity.js.map