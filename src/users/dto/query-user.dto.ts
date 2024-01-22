import { ApiProperty } from '@nestjs/swagger';

export class QueryUserDto {
  @ApiProperty({ nullable: true, required: false })
  search_name: string;
}
