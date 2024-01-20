import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Restaurant')
export class RestaurantEntity {
  @PrimaryGeneratedColumn()
  restaurant_id: string;

  @Column()
  restaurant_name: string;

  @Column()
  restaurant_address: string;

  @Column()
  restaurant_phone: string;
}
