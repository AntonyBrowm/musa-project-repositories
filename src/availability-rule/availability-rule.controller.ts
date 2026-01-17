import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AvailabilityRuleService } from './availability-rule.service';
import { CreateAvailabilityRuleDto } from './dto/create-availability-rule.dto';
import { UpdateAvailabilityRuleDto } from './dto/update-availability-rule.dto';
import { BulkAvailabilityDto } from './dto/bulk-availability.dto';

@Controller('availability-rule')
export class AvailabilityRuleController {
  constructor(
    private readonly availabilityRuleService: AvailabilityRuleService,
  ) {}

  @Post()
  create(@Body() createAvailabilityRuleDto: CreateAvailabilityRuleDto) {
    return this.availabilityRuleService.create(createAvailabilityRuleDto);
  }
  @Post('bulk')
  bulk(@Body() dto: BulkAvailabilityDto) {
    return this.availabilityRuleService.bulkUpsert(dto);
  }
  @Get()
  findAll() {
    return this.availabilityRuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.availabilityRuleService.findByProfessional(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAvailabilityRuleDto: UpdateAvailabilityRuleDto,
  ) {
    return this.availabilityRuleService.update(+id, updateAvailabilityRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.availabilityRuleService.remove(+id);
  }
}
