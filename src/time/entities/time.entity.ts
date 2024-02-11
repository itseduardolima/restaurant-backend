import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TablesEntity } from 'src/tables/entities/table.entity';
import { TimeStatus } from 'src/common/utils/Enum';

@Entity('Time')
export class TimeEntity {
  @PrimaryGeneratedColumn('uuid')
  time_id: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column()
  table_id: string;

  @Column({ type: 'enum', enum: TimeStatus, default: TimeStatus.FREE })
  time_status: TimeStatus;

  @ManyToOne(() => TablesEntity, table => table.times)
  @JoinColumn({ name: 'table_id' })
  table: TablesEntity;
}
