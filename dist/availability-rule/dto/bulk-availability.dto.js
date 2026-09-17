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
exports.BulkAvailabilityDto = void 0;
const class_validator_1 = require("class-validator");
class BulkAvailabilityDto {
    professionalId;
    days;
    startTime;
    endTime;
    active;
}
exports.BulkAvailabilityDto = BulkAvailabilityDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], BulkAvailabilityDto.prototype, "professionalId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(0, { each: true }),
    (0, class_validator_1.Max)(6, { each: true }),
    __metadata("design:type", Array)
], BulkAvailabilityDto.prototype, "days", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/),
    __metadata("design:type", String)
], BulkAvailabilityDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{2}:\d{2}$/),
    __metadata("design:type", String)
], BulkAvailabilityDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BulkAvailabilityDto.prototype, "active", void 0);
//# sourceMappingURL=bulk-availability.dto.js.map