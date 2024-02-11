import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TimeEntity } from 'src/time/entities/time.entity';

@Entity('Tables')
export class TablesEntity {
  @PrimaryGeneratedColumn('uuid')
  table_id: string;

  @Column()
  table_number: number;

  @Column()
  table_capacity: number;

  @OneToMany(() => TimeEntity, time => time.table)
  times: TimeEntity[];
}
