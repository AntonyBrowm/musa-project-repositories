import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { ServicesModule } from './services/services.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { AvailabilityRuleModule } from './availability-rule/availability-rule.module';
import { AvailabilityExceptionModule } from './availability-exception/availability-exception.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // solo en desarrollo
    }),
    AppointmentsModule,
    ServicesModule,
    ProfessionalsModule,
    CategoriesModule,
    AvailabilityRuleModule,
    AvailabilityExceptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
