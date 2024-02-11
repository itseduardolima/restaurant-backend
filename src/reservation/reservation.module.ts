import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { TimeEntity } from 'src/time/entities/time.entity';
import { TimeModule } from 'src/time/time.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationEntity, TimeEntity]),
    TimeModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
