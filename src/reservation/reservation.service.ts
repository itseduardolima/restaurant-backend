import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { UpdateReservationDTO } from './dto/update-reservation.dto';


@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
  ) {}

  async create(createReservationDTO: CreateReservationDTO): Promise<ReservationEntity> {
    const { userId, tableId, reservationDate } = createReservationDTO;
    const reservation = this.reservationRepository.create({
      user: { user_id: userId },
      table: { table_id: tableId },
      reservation_date: reservationDate,
    });
    return await this.reservationRepository.save(reservation);
  }

  async getAllReservations() {
    return await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.table', 'table')
      .leftJoinAndSelect('reservation.user', 'user')
      .select([
        'reservation.reservation_id',
        'reservation.reservation_date',
        'reservation.user',
        'user.user_id',
        'user.user_name',
        'table'
        
      ])
      .getMany();
  }

  async findById(reservationId: string): Promise<ReservationEntity> {
    const reservation = await this.reservationRepository.findOne({where: {reservation_id: reservationId}});
    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }
    return reservation;
  }

  async update(reservationId: string, updateReservationDTO: UpdateReservationDTO): Promise<ReservationEntity> {
    await this.findById(reservationId);
    await this.reservationRepository.update(reservationId, updateReservationDTO);
    return await this.findById(reservationId);
  }

  async remove(reservationId: string): Promise<void> {
    await this.findById(reservationId);
    await this.reservationRepository.delete(reservationId);
  }
}
