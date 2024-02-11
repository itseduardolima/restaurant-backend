import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeEntity } from './entities/time.entity';
import { CreateTimeDto } from './dto/create-time.dto';

@Injectable()
export class TimeService {
  constructor(
    @InjectRepository(TimeEntity)
    private readonly timeRepository: Repository<TimeEntity>,
  ) {}

  async create(creatTimeDTO: CreateTimeDto) {
    const time = this.timeRepository.create(creatTimeDTO);
    return await this.timeRepository.save(time);
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
