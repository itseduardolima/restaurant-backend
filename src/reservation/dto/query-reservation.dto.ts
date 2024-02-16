import { ApiProperty } from '@nestjs/swagger';

export class QueryReservationDto {
  @ApiProperty({ nullable: true, required: false })
  search_capacity: Number;

}
