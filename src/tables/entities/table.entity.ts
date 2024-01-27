import { TableState } from 'src/common/utils/Enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Tables')
export class TablesEntity {
  @PrimaryGeneratedColumn('uuid')
  table_id: string;

  @Column()
  table_number: number;

  @Column()
  table_capacity: number;

  @Column({ type: 'enum', enum: TableState, default: TableState.FREE })
  table_state: TableState;
}
