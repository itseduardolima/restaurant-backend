import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { TimeService } from './time.service';
import { CreateTimeDto } from './dto/create-time.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';
import { PublicRoute } from 'src/common/decorator/public_route.decorator';

@ApiTags('Time')
@Controller('time')
@ApiBearerAuth()

export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @PublicRoute()
  @Get()
  async findAll() {
    return this.timeService.findAll();
  }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async create(@Body() createTimeDto: CreateTimeDto) {
    return this.timeService.create(createTimeDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async remove(@Param('id') id: string) {
    return this.timeService.remove(id);
  }
}
