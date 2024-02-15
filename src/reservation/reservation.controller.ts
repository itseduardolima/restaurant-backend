import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { UpdateReservationDTO } from './dto/update-reservation.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';
import { QueryCapacityDto } from './dto/query-reservation.dto';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';

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

  
  @Get('availability')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota mostra horários disponíveis para esta data.` })
  @ApiQuery({ name: 'date', description: '### informe a data para realizar esta busca (yyyy-mm-dd)' })
  async checkAvailability(@Query() paginationFilter: FilterWorkstation, @Query('date') date: string, @Query() searchType: QueryCapacityDto,) {
    return await this.reservationService.checkAvailability(paginationFilter, date, searchType);
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
