import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TablesEntity } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';


@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(TablesEntity)
    private readonly tablesRepository: Repository<TablesEntity>,
  ) {}

  async createTable(createTableDto: CreateTableDto): Promise<TablesEntity> {
    const table = this.tablesRepository.create(createTableDto);
    return this.tablesRepository.save(table);
  }

  async findAllTables(): Promise<TablesEntity[]> {
    return this.tablesRepository.find();
  }

  async findById(id: string) {
    return this.tablesRepository
      .createQueryBuilder('tables')
      .where('tables.table_id = :table_id', { table_id: id })
      .getOne();
  }

  async update(id: string, updateTableDto: CreateTableDto): Promise<TablesEntity> {
    await this.findById(id); 
    await this.tablesRepository.update(id, updateTableDto);
    return this.findById(id); 
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.tablesRepository.delete(id);
  }
}
