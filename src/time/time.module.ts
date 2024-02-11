import { Module } from '@nestjs/common';
import { TimeService } from './time.service';
import { TimeController } from './time.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntity } from './entities/time.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeEntity])],
  controllers: [TimeController],
  providers: [TimeService],
})
export class TimeModule {}
