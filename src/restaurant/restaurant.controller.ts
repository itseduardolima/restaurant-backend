import { Controller, Get, Body, Param, Put } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Listagem de todos os restaurantes' })
  findAll() {
    return this.restaurantService.findAll();
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Atualiza um restaurante com base no ID' })
  update(@Param('id') id: string, @Body() updateDto: UpdateRestaurantDto) {
    return this.restaurantService.update(id, updateDto);
  }
}
