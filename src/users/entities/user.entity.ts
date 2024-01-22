import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('Users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  user_name: string;

  @Column()
  user_email: string;

  @Column()
  user_password: string;

  @Column()
  user_phone: string;

  @Column()
  user_status: boolean;

  @Column()
  user_profile: number;

  @CreateDateColumn({ name: 'user_created_date' })
  userCreatedDate: Date;

  @UpdateDateColumn({ name: 'user_update_date' })
  userUpdateDate: Date;

  @ManyToOne(() => ProfileEntity, (profile) => profile.users)
  @JoinColumn({ name: 'user_profile' })
  profile: ProfileEntity
}
