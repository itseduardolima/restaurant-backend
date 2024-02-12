import { BadRequestException, Injectable } from '@nestjs/common';
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

  async getByNumber(number: number) {
    return this.tablesRepository.createQueryBuilder('table')
      .where('table.table_number = :number', { number })
      .getOne()
  }

  async createTable(createTableDto: CreateTableDto): Promise<TablesEntity> {

    const table = this.tablesRepository.create(createTableDto);
    const tableExist = await this.getByNumber(table.table_number)

    if (tableExist) {
      throw new BadRequestException(`A mesa ${table.table_number} já existe`);
    }

    return this.tablesRepository.save(table);
  }

  async findAllTables() {
    return await this.tablesRepository
    .createQueryBuilder('table')
      .select([
        'table'
      ])
      .getMany();
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
