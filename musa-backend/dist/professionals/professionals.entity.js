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
exports.Professional = void 0;
const category_entity_1 = require("../categories/entities/category.entity");
const typeorm_1 = require("typeorm");
let Professional = class Professional {
    id;
    name;
    number;
    color;
    active;
    categories;
};
exports.Professional = Professional;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Professional.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Professional.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Professional.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Professional.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Professional.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => category_entity_1.Category, { eager: false }),
    (0, typeorm_1.JoinTable)({
        name: 'professional_categories',
        joinColumn: { name: 'professional_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Professional.prototype, "categories", void 0);
exports.Professional = Professional = __decorate([
    (0, typeorm_1.Entity)('professionals')
], Professional);
//# sourceMappingURL=professionals.entity.js.map