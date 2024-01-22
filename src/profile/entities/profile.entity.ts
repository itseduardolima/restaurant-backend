import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Profile')
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  profile_id: number;

  @Column()
  profile_name: string;

  @OneToMany(() => UserEntity, (user) => user.profile)
  users: UserEntity[];
}
