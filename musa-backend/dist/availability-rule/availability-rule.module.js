"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityRuleModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const availability_rule_service_1 = require("./availability-rule.service");
const availability_rule_controller_1 = require("./availability-rule.controller");
const availability_rule_entity_1 = require("./entities/availability-rule.entity");
const professionals_entity_1 = require("../professionals/professionals.entity");
let AvailabilityRuleModule = class AvailabilityRuleModule {
};
exports.AvailabilityRuleModule = AvailabilityRuleModule;
exports.AvailabilityRuleModule = AvailabilityRuleModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([availability_rule_entity_1.AvailabilityRule, professionals_entity_1.Professional])],
        controllers: [availability_rule_controller_1.AvailabilityRuleController],
        providers: [availability_rule_service_1.AvailabilityRuleService],
        exports: [availability_rule_service_1.AvailabilityRuleService],
    })
], AvailabilityRuleModule);
//# sourceMappingURL=availability-rule.module.js.map