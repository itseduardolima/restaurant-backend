import {  ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Between, Brackets, Repository } from 'typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { UpdateReservationDTO } from './dto/update-reservation.dto';
import * as moment from 'moment';
import { TablesEntity } from 'src/tables/entities/table.entity';
import { QueryReservationDto } from './dto/query-reservation.dto';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { QueryUserDto } from 'src/users/dto/query-user.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(TablesEntity)
    private readonly tablesRepository: Repository<TablesEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAllReservations(search: QueryUserDto) {
    const { search_name, search_userId } = search;
    const query = this.reservationRepository.createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.table', 'table')
        .leftJoinAndSelect('reservation.user', 'user')
        .select([
            'reservation.reservation_id',
            'reservation.reservation_date',
            'user.user_id',
            'user.user_name',
            'table',  
        ]);

        if (search_name || search_userId) {
          query.andWhere(new Brackets(queryBuilderOne => {
              if (search_name) {
                  queryBuilderOne
                      .where('user.user_name LIKE :user_name', { user_name: `%${search_name}%` })
              }
              if (search_userId) {
                  queryBuilderOne
                      .orWhere('user.user_id LIKE :user_id', { user_id: `%${search_userId}%` })
              }
          }));
      }

    return await query.getMany();
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

  async checkAvailability(PaginationFilter: FilterWorkstation, currentDate: string, search: QueryReservationDto) {
    const { search_capacity } = search;
    const {sort} = PaginationFilter
    const query = this.tablesRepository.createQueryBuilder('table');

    if (search_capacity) {
        query.andWhere('table.table_capacity LIKE :table_capacity', {
            table_capacity: `${search_capacity}%`,
        });
    }

    query.orderBy('table.table_number', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);

    const selectedDate = new Date(currentDate);
    selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset());

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
        const matchingAppointments = appointmentsForDay.filter(app =>
            app.reservation_date.getTime() === slot.getTime()
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
            time: slot.toISOString(),
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
