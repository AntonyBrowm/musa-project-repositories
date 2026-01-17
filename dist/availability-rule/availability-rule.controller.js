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
exports.AvailabilityRuleController = void 0;
const common_1 = require("@nestjs/common");
const availability_rule_service_1 = require("./availability-rule.service");
const create_availability_rule_dto_1 = require("./dto/create-availability-rule.dto");
const update_availability_rule_dto_1 = require("./dto/update-availability-rule.dto");
const bulk_availability_dto_1 = require("./dto/bulk-availability.dto");
let AvailabilityRuleController = class AvailabilityRuleController {
    availabilityRuleService;
    constructor(availabilityRuleService) {
        this.availabilityRuleService = availabilityRuleService;
    }
    create(createAvailabilityRuleDto) {
        return this.availabilityRuleService.create(createAvailabilityRuleDto);
    }
    bulk(dto) {
        return this.availabilityRuleService.bulkUpsert(dto);
    }
    findAll() {
        return this.availabilityRuleService.findAll();
    }
    findOne(id) {
        return this.availabilityRuleService.findByProfessional(+id);
    }
    update(id, updateAvailabilityRuleDto) {
        return this.availabilityRuleService.update(+id, updateAvailabilityRuleDto);
    }
    remove(id) {
        return this.availabilityRuleService.remove(+id);
    }
};
exports.AvailabilityRuleController = AvailabilityRuleController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_availability_rule_dto_1.CreateAvailabilityRuleDto]),
    __metadata("design:returntype", void 0)
], AvailabilityRuleController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_availability_dto_1.BulkAvailabilityDto]),
    __metadata("design:returntype", void 0)
], AvailabilityRuleController.prototype, "bulk", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AvailabilityRuleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AvailabilityRuleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_availability_rule_dto_1.UpdateAvailabilityRuleDto]),
    __metadata("design:returntype", void 0)
], AvailabilityRuleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AvailabilityRuleController.prototype, "remove", null);
exports.AvailabilityRuleController = AvailabilityRuleController = __decorate([
    (0, common_1.Controller)('availability-rule'),
    __metadata("design:paramtypes", [availability_rule_service_1.AvailabilityRuleService])
], AvailabilityRuleController);
//# sourceMappingURL=availability-rule.controller.js.map