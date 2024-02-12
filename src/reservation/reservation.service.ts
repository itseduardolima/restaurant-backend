import {  ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Between, Repository } from 'typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { UpdateReservationDTO } from './dto/update-reservation.dto';
import { TimeEntity } from 'src/time/entities/time.entity';
import * as moment from 'moment';

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

     const slotDurationMinutes = 60;
     const slotsPerHour = 60 / slotDurationMinutes;
     const startDateTime = moment(reservationDate).startOf('hour');

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
      time: { time_id: timeId },
      reservation_date: reservationDate,
    });

    return await this.reservationRepository.save(reservation);
  }

  async checkAvailability(currentDate: string) {

    const selectedDate = new Date(currentDate);
    selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset());

    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);

    const appointmentsForDay = await this.reservationRepository.find({
      where: {
        reservation_date: Between(selectedDate, nextDay)
      },
      
    });

    const timeSlots = this.generateTimeSlots(selectedDate);
    const schedule = [];

    for (const slot of timeSlots) {
      const matchingAppointment = appointmentsForDay.find(app =>
        app.reservation_date.getTime() === slot.getTime()
      );

      schedule.push({
        time: slot.toISOString(),
        isBooked: !!matchingAppointment,        
      });
    }

    return schedule;
  }

  generateTimeSlots(date: Date): Date[] {
    const UTC_OFFSET_MANAUS = 0;
    const startTime = 18;
    const endTime = 22;
    const slots = [];

    for (let hour = startTime; hour < endTime; hour++) {
      const slot = new Date(date);

      slot.setUTCHours(hour + UTC_OFFSET_MANAUS, 0, 0, 0);
      slots.push(slot);
    }

    return slots;
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
