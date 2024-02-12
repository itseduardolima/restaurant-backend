import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Tables')
export class TablesEntity {
  @PrimaryGeneratedColumn('uuid')
  table_id: string;

  @Column()
  table_number: number;

  @Column()
  table_capacity: number;
}
