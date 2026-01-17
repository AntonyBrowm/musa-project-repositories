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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityExceptionController = void 0;
const common_1 = require("@nestjs/common");
const availability_exception_service_1 = require("./availability-exception.service");
const create_availability_exception_dto_1 = require("./dto/create-availability-exception.dto");
const update_availability_exception_dto_1 = require("./dto/update-availability-exception.dto");
let AvailabilityExceptionController = class AvailabilityExceptionController {
    availabilityExceptionService;
    constructor(availabilityExceptionService) {
        this.availabilityExceptionService = availabilityExceptionService;
    }
    create(createAvailabilityExceptionDto) {
        return this.availabilityExceptionService.create(createAvailabilityExceptionDto);
    }
    findAll() {
        return this.availabilityExceptionService.findAll();
    }
    findOne(id) {
        return this.availabilityExceptionService.findOne(+id);
    }
    update(id, updateAvailabilityExceptionDto) {
        return this.availabilityExceptionService.update(+id, updateAvailabilityExceptionDto);
    }
    remove(id) {
        return this.availabilityExceptionService.remove(+id);
    }
};
exports.AvailabilityExceptionController = AvailabilityExceptionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_availability_exception_dto_1.CreateAvailabilityExceptionDto]),
    __metadata("design:returntype", void 0)
], AvailabilityExceptionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AvailabilityExceptionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AvailabilityExceptionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_availability_exception_dto_1.UpdateAvailabilityExceptionDto]),
    __metadata("design:returntype", void 0)
], AvailabilityExceptionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AvailabilityExceptionController.prototype, "remove", null);
exports.AvailabilityExceptionController = AvailabilityExceptionController = __decorate([
    (0, common_1.Controller)('availability-exception'),
    __metadata("design:paramtypes", [availability_exception_service_1.AvailabilityExceptionService])
], AvailabilityExceptionController);
//# sourceMappingURL=availability-exception.controller.js.map