import { Controller, Get, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'src/common/decorator/public_route.decorator';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';

@ApiTags('restaurant')
@Controller('restaurant')
@ApiBearerAuth()

export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @PublicRoute()
  @Get()
  @ApiResponse({ status: 200, description: 'Lista o nome do restaurante' })
  findAll() {
    return this.restaurantService.findAll();
  }

  @Patch(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  @ApiResponse({ status: 200, description: 'Atualiza o nome do restaurante' })
  update(@Param('id') id: string, @Body() updateDto: UpdateRestaurantDto) {
    return this.restaurantService.update(id, updateDto);
  }
}
