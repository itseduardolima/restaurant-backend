import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  user_create_date: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  user_update_date: Date;
}
