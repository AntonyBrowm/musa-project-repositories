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

      // ✅ PRODUCCIÓN (Railway, Render, etc)
      url: process.env.DATABASE_URL,

      // ✅ DESARROLLO LOCAL (fallback)
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,

      autoLoadEntities: true,

      // ⚠️ SOLO true en local
      synchronize: process.env.NODE_ENV !== 'production',

      // ✅ SSL obligatorio en la nube
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
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
