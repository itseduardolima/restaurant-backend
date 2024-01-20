import { ApiProperty, OmitType } from '@nestjs/swagger';
import { RestaurantEntity } from '../entities/restaurant.entity';

export class UpdateRestaurantDto extends OmitType(RestaurantEntity, ['restaurant_id']) {
  @ApiProperty()
  restaurant_name: string;

  @ApiProperty()
  restaurant_address: string;

  @ApiProperty()
  restaurant_phone: string;
}
