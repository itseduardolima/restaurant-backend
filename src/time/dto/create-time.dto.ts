import { ApiProperty, OmitType } from "@nestjs/swagger";
import { TimeEntity } from "../entities/time.entity";

export class CreateTimeDto extends OmitType(TimeEntity, ['time_id', 'time_status']) {

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  table_id: string;
}