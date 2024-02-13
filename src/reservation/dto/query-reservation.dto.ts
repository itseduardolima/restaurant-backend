import { ApiProperty } from '@nestjs/swagger';

export class QueryCapacityDto {
  @ApiProperty({ nullable: true, required: false })
  search_capacity: Number;
}
