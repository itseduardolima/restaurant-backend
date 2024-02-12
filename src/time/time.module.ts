import { Module } from '@nestjs/common';
import { TimeService } from './time.service';
import { TimeController } from './time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntity } from './entities/time.entity';
import { TablesEntity } from 'src/tables/entities/table.entity';
import { TablesModule } from 'src/tables/tables.module';

@Module({
  imports: [TypeOrmModule.forFeature([TimeEntity, TablesEntity]), TablesModule],
  controllers: [TimeController],
  providers: [TimeService],
})
export class TimeModule {}
