import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Delete,
  Put,
  Res,     
  Header, 
} from '@nestjs/common';
import express from 'express';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './appointments.entity';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() dto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentsService.create(dto);
  }

  @Get()
  findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Get('/calendar')
  getCalendar(@Query('date') date: any) {
    return this.appointmentsService.getCalendar(date);
  }
  // appointments.controller.ts
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.update(id, dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Appointment> {
    return this.appointmentsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.appointmentsService.remove(id);
    return { success: true };
  }

  @Get('feed/:professionalId.ics')
  @Header('Content-Type', 'text/calendar; charset=utf-8')
  @Header('Content-Disposition', 'inline; filename="agenda-musa.ics"')
  async getFeed(
    @Param('professionalId', ParseIntPipe) professionalId: number,
    @Res() res: express.Response,
  ) {
    const icsData = await this.appointmentsService.getIcsFeed(professionalId);
    return res.send(icsData);
  }
}
