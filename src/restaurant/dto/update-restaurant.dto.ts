import { OmitType } from '@nestjs/mapped-types';
import { RestaurantEntity } from '../entities/restaurant.entity';

export class UpdateRestaurantDto extends OmitType(RestaurantEntity, ['restaurant_id']) {
  restaurant_name: string;
  restaurant_address: string;
  restaurant_phone: string;
}
