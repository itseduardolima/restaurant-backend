import { ApiProperty, OmitType } from "@nestjs/swagger";
import { TimeEntity } from "../entities/time.entity";

export class CreateTimeDto extends OmitType(TimeEntity, ['time_id', "table_id"]) {

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

}