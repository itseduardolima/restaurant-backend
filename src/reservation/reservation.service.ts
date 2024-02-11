import {  ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { UpdateReservationDTO } from './dto/update-reservation.dto';
import { TimeEntity } from 'src/time/entities/time.entity';
import { TimeStatus } from 'src/common/utils/Enum';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(TimeEntity)
    private readonly timeRepository: Repository<TimeEntity>,
  ) {}

  async getAllReservations() {
    return await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.table', 'table')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.time', 'time')
      .select([
        'reservation.reservation_id',
        'reservation.reservation_date',
        'reservation.user',
        'user.user_id',
        'user.user_name',
        'table',
        'time'
      ])
      .getMany();
  }

  async create(createReservationDTO: CreateReservationDTO): Promise<ReservationEntity> {
    const { userId, tableId, reservationDate, timeId } = createReservationDTO;

    // Verifique se o horário está disponível
    const time = await this.timeRepository.findOne({where: {time_id: timeId}});
    if (!time || time.time_status !== 'FREE') {
      throw new ConflictException('O horário selecionado não está disponível.');
    }

    // Crie uma nova reserva associada ao horário específico
    const reservation = this.reservationRepository.create({
      user: { user_id: userId },
      table: { table_id: tableId },
      time: { time_id: timeId }, // Associe a reserva ao horário específico
      reservation_date: reservationDate,
    });

    // Atualize o status do horário para "RESERVED"
    time.time_status = TimeStatus.RESERVED;
    await this.timeRepository.save(time);

    // Salve a reserva e retorne
    return await this.reservationRepository.save(reservation);
  }
  

  async findById(reservationId: string): Promise<ReservationEntity> {
    const reservation = await this.reservationRepository.findOne({where: {reservation_id: reservationId}});
    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }
    return reservation;
  }

  async findByTimeId(timeId: string) {
    const time = await this.timeRepository.findOne({where: {time_id: timeId}});
    
    return time;
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
