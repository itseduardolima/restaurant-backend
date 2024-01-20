import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantEntity } from './entities/restaurant.entity';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async findAll() {
    return await this.restaurantRepository.find();
  }

  async findOne(id: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurant_id: id },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurante não encontrado');
    }
    return restaurant;
  }

  async update(id: string, updateDto: UpdateRestaurantDto) {
    await this.findOne(id);
    await this.restaurantRepository.update(id, updateDto);
    return await this.findOne(id);
  }
}
