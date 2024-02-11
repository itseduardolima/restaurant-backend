import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TablesEntity } from '../entities/table.entity';

export class CreateTableDto extends OmitType(TablesEntity, ['table_id']) {

  @ApiProperty()
  table_number: number;

  @ApiProperty()
  table_capacity: number;
}
