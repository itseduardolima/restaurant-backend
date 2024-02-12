import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeEntity } from './entities/time.entity';
import { CreateTimeDto } from './dto/create-time.dto';
import { TablesEntity } from 'src/tables/entities/table.entity';

@Injectable()
export class TimeService {
  constructor(
    @InjectRepository(TimeEntity)
    private readonly timeRepository: Repository<TimeEntity>,
    @InjectRepository(TablesEntity)
    private readonly tablesRepository: Repository<TablesEntity>,
  ) {}

  async create(createTimeDTO: CreateTimeDto) {
    const tables = await this.tablesRepository.find();
    const createdTimeSlots = [];

    for (const table of tables) {
      
      const existingTimeSlot = await this.timeRepository.findOne({
        where: {
          table_id: table.table_id,
          startTime: createTimeDTO.startTime,
          endTime: createTimeDTO.endTime
        }
      });

      if (existingTimeSlot) {
        throw new ConflictException(`Horário já existente.`);
      }

      const newTimeSlot = this.timeRepository.create({
        ...createTimeDTO,
        table_id: table.table_id,
      });
      const savedTimeSlot = await this.timeRepository.save(newTimeSlot);
      createdTimeSlots.push(savedTimeSlot);
    }

    return createdTimeSlots;

  }


  async findAll(): Promise<TimeEntity[]> {
    return await this.timeRepository.find();
  }

  async findById(id: string) {
    return this.timeRepository
      .createQueryBuilder('time')
      .where('time.time_id = :time_id', { time_id: id })
      .getOne();
  }

  async remove(id: string) {
    await this.findById(id);
    await this.timeRepository.delete(id);
  }
}
