import { TablesEntity } from 'src/tables/entities/table.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Reservations')
export class ReservationEntity {
  @PrimaryGeneratedColumn('uuid')
  reservation_id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => TablesEntity)
  @JoinColumn({ name: 'table_id' })
  table: TablesEntity;

  @Column({ type: 'timestamp' })
  reservation_date: Date;

  @CreateDateColumn({ name: 'reservation_created_at' })
  reservation_created_at: Date;

  @UpdateDateColumn({ name: 'reservation_updated_at' })
  reservation_updated_at: Date;
}
