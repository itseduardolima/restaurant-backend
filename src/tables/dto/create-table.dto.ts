import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TablesEntity } from '../entities/table.entity';
import { TableState } from 'src/common/utils/Enum';

export class CreateTableDto extends OmitType(TablesEntity, ['table_id']) {

  @ApiProperty()
  table_number: number;

  @ApiProperty()
  table_capacity: number;

  @ApiProperty({ enum: TableState, default: TableState.FREE })
  table_state: TableState;
}
