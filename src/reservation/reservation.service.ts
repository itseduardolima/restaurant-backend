import {  ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Between, Repository } from 'typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { UpdateReservationDTO } from './dto/update-reservation.dto';
import * as moment from 'moment';
import { TablesEntity } from 'src/tables/entities/table.entity';
import { QueryCapacityDto } from './dto/query-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(TablesEntity)
    private readonly tablesRepository: Repository<TablesEntity>,
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
    console.log("Create Reservation DTO:", createReservationDTO);
    const { userId, tableId, reservationDate } = createReservationDTO;

    const slotDurationMinutes = 60;
    const slotsPerHour = 60 / slotDurationMinutes;
    const startDateTime = moment(reservationDate).startOf('hour');

    console.log("Start DateTime:", startDateTime.toString());

    for (let slot = 0; slot < slotsPerHour; slot++) {
        const slotStartDateTime = startDateTime.clone().add(slot * slotDurationMinutes, 'minutes');
        const slotEndDateTime = slotStartDateTime.clone().add(slotDurationMinutes, 'minutes');

        console.log("Slot Start DateTime:", slotStartDateTime.toString());
        console.log("Slot End DateTime:", slotEndDateTime.toString());
 
        const existingReservation = await this.reservationRepository.findOne({
            where: {
                table: { table_id: tableId },
                reservation_date: Between(slotStartDateTime.toDate(), slotEndDateTime.toDate()),
            },
        });

        console.log("Existing Reservation:", existingReservation);
 
        if (existingReservation) {
            throw new ConflictException('Esta mesa já está reservada para esse horário.');
        }
    }
 
    const reservation = this.reservationRepository.create({
        user: { user_id: userId },
        table: { table_id: tableId },
        reservation_date: reservationDate,
    });

    console.log("New Reservation:", reservation);

    return await this.reservationRepository.save(reservation);

  }

  async checkAvailability(currentDate: string, search: QueryCapacityDto) {
    const { search_capacity } = search;
    const query = this.tablesRepository.createQueryBuilder('table');

    if (search_capacity) {
        query.andWhere('table.table_capacity LIKE :table_capacity', {
            table_capacity: `${search_capacity}%`,
        });
    }

    const selectedDate = new Date(currentDate);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);

    const appointmentsForDay = await this.reservationRepository.find({
        where: {
            reservation_date: Between(selectedDate, nextDay)
        },
        relations: ['table']
    });

    const timeSlots = this.generateTimeSlots(selectedDate);
    const schedule = [];

    for (const slot of timeSlots) {
        const slotTime = slot.toISOString().split('T')[1].slice(0, 8);
        const matchingAppointments = appointmentsForDay.filter(app =>
            app.reservation_date.toISOString().split('T')[1].slice(0, 8) === slotTime
        );

        const tablesAvailability = [];

        if (search_capacity) {
            const filteredTables = await query.getMany();
            for (const table of filteredTables) {
                const isBooked = matchingAppointments.some(app => app.table.table_id === table.table_id);
                tablesAvailability.push({
                    table_id: table.table_id,
                    table_number: table.table_number,
                    table_capacity: table.table_capacity,
                    isBooked: isBooked
                });
            }
        } else {
            const allTables = await this.tablesRepository.find();
            for (const table of allTables) {
                const isBooked = matchingAppointments.some(app => app.table.table_id === table.table_id);
                tablesAvailability.push({
                    table_id: table.table_id,
                    table_number: table.table_number,
                    table_capacity: table.table_capacity,
                    isBooked: isBooked
                });
            }
        }

        schedule.push({
            time: slotTime,
            tables: tablesAvailability
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
