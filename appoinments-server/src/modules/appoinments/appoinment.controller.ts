import { Controller, Get, Post, Body, Put, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AppoimentService } from './appoinment.service';
import { CreateAppointmentDto } from './dto/appointment.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('appoinments')
export class AppoimentController {
  constructor(private readonly service: AppoimentService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@Request() req) {
    return this.service.get(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async search(@Query('keyword') keyword) {
    return await this.service.search(keyword);
  }

  @Post()
  async create(@Body() user: CreateAppointmentDto) {
    return this.service.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('accept/:id')
  async accept(@Param('id') id: number, @Body() updateData: any, @Request() req) {
    return this.service.acceptAppointment({ status: 2, ...updateData }, id, req.user);
  }

  @Put('cancel/:id')
  async cancel(@Param('id') id: number) {
    return this.service.update({ status: 3 }, id);
  }

  @Put('finish/:id')
  async finish(@Param('id') id: number) {
    return this.service.update({ status: 4 }, id);
  }
}
