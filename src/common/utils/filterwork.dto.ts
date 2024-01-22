import { ApiProperty } from '@nestjs/swagger';
import { FilterPagination } from './filter.pagination';

export class FilterWorkstation extends FilterPagination {
  @ApiProperty({ required: false, default: 'goal_id', enum: ['goal_id'] })
  orderBy: string;
}
