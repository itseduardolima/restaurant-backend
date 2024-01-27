import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ReservationEntity } from '../entities/reservation.entity';

export class CreateReservationDTO extends OmitType(ReservationEntity, ['reservation_id', 'reservation_created_at', 'reservation_updated_at']) {
    
  @ApiProperty()
  userId: string;

  @ApiProperty()
  tableId: string;

  @ApiProperty()
  reservationDate: Date;
}
