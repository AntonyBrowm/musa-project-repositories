"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityExceptionService = void 0;
const common_1 = require("@nestjs/common");
let AvailabilityExceptionService = class AvailabilityExceptionService {
    create(createAvailabilityExceptionDto) {
        return 'This action adds a new availabilityException';
    }
    findAll() {
        return `This action returns all availabilityException`;
    }
    findOne(id) {
        return `This action returns a #${id} availabilityException`;
    }
    update(id, updateAvailabilityExceptionDto) {
        return `This action updates a #${id} availabilityException`;
    }
    remove(id) {
        return `This action removes a #${id} availabilityException`;
    }
};
exports.AvailabilityExceptionService = AvailabilityExceptionService;
exports.AvailabilityExceptionService = AvailabilityExceptionService = __decorate([
    (0, common_1.Injectable)()
], AvailabilityExceptionService);
//# sourceMappingURL=availability-exception.service.js.map