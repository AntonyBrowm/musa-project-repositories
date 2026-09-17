"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const appointments_module_1 = require("./appointments/appointments.module");
const services_module_1 = require("./services/services.module");
const professionals_module_1 = require("./professionals/professionals.module");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const categories_module_1 = require("./categories/categories.module");
const availability_rule_module_1 = require("./availability-rule/availability-rule.module");
const availability_exception_module_1 = require("./availability-exception/availability-exception.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
                username: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                autoLoadEntities: true,
                synchronize: true,
                ssl: process.env.NODE_ENV === 'production'
                    ? { rejectUnauthorized: false }
                    : false,
            }),
            appointments_module_1.AppointmentsModule,
            services_module_1.ServicesModule,
            professionals_module_1.ProfessionalsModule,
            categories_module_1.CategoriesModule,
            availability_rule_module_1.AvailabilityRuleModule,
            availability_exception_module_1.AvailabilityExceptionModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map