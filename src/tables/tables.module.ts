import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TablesEntity } from './entities/table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TablesEntity])],
  controllers: [TablesController],
  providers: [TablesService],
})
export class TablesModule {}
