import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { UpdateReservationDTO } from './dto/update-reservation.dto';
import * as moment from 'moment';


@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
  ) {}

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

  async create(createReservationDTO: CreateReservationDTO): Promise<ReservationEntity> {
    const { userId, tableId, reservationDate } = createReservationDTO;

    // Define a duração de cada slot de tempo em minutos
    const slotDurationMinutes = 60; // 1 hora
    const slotsPerHour = 60 / slotDurationMinutes;

    // Obtem a data e hora inicial para a reserva
    const startDateTime = moment(reservationDate).startOf('hour');

    // Divide o período de reserva em slots de tempo e verifica cada um deles
    for (let slot = 0; slot < slotsPerHour; slot++) {
      const slotStartDateTime = startDateTime.clone().add(slot * slotDurationMinutes, 'minutes');
      const slotEndDateTime = slotStartDateTime.clone().add(slotDurationMinutes, 'minutes');

      const existingReservation = await this.reservationRepository.findOne({
        where: {
          table: { table_id: tableId },
          reservation_date: Between(slotStartDateTime.toDate(), slotEndDateTime.toDate()),
        },
      });

      if (existingReservation) {
        throw new ConflictException('Esta mesa já está reservada para esse horário.');
      }
    }

    const reservation = this.reservationRepository.create({
      user: { user_id: userId },
      table: { table_id: tableId },
      reservation_date: reservationDate,
    });
    return await this.reservationRepository.save(reservation);
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
