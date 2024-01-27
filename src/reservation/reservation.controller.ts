import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { UpdateReservationDTO } from './dto/update-reservation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';

@Controller('reservations')
@ApiTags('reservations')
@ApiBearerAuth()

export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  async create(@Body() createReservationDTO: CreateReservationDTO) {
    return await this.reservationService.create(createReservationDTO);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  async getAllReservations() {
    return await this.reservationService.getAllReservations();
  }

  @Get(':id')
  async getReservationById(@Param('id') reservationId: string) {
    return await this.reservationService.findById(reservationId);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  async update(@Param('id') reservationId: string, @Body() updateReservationDTO: UpdateReservationDTO) {
    return await this.reservationService.update(reservationId, updateReservationDTO);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  async delete(@Param('id') reservationId: string) {
    return await this.reservationService.remove(reservationId);
  }
}
