"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const professionals_entity_1 = require("./professionals.entity");
const professionals_service_1 = require("./professionals.service");
const professionals_controller_1 = require("./professionals.controller");
const category_entity_1 = require("../categories/entities/category.entity");
const availability_rule_entity_1 = require("../availability-rule/entities/availability-rule.entity");
let ProfessionalsModule = class ProfessionalsModule {
};
exports.ProfessionalsModule = ProfessionalsModule;
exports.ProfessionalsModule = ProfessionalsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([professionals_entity_1.Professional, category_entity_1.Category, availability_rule_entity_1.AvailabilityRule]),
        ],
        controllers: [professionals_controller_1.ProfessionalsController],
        providers: [professionals_service_1.ProfessionalsService],
        exports: [typeorm_1.TypeOrmModule],
    })
], ProfessionalsModule);
//# sourceMappingURL=professionals.module.js.map