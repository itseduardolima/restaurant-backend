import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { TablesEntity } from 'src/tables/entities/table.entity';
import { TablesModule } from 'src/tables/tables.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationEntity, TablesEntity]),
    TablesModule
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
