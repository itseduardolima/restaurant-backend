import { Controller, Post, Get, Delete, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { PublicRoute } from 'src/common/decorator/public_route.decorator';
import { CreateTableDto } from 'src/tables/dto/create-table.dto';
import { TablesService } from 'src/tables/tables.service';

@ApiTags('Tables')
@Controller('tables')
@ApiBearerAuth()
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async createTable(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.createTable(createTableDto);
  }

  @PublicRoute()
  @Get()
  async findAllTables() {
    return this.tablesService.findAllTables();
  }

  @PublicRoute()
  @Get(':id')
  async findTableById(@Param('id') id: string) {
    return this.tablesService.findById(id);
  }

  @UseGuards(PermissionGuard(AccessProfile.ADMIN_EMPLOYEE))
  @Patch(':id')
  async updateTable(@Param('id') id: string, @Body() updateTableDto: CreateTableDto) {
    return this.tablesService.update(id, updateTableDto);
  }

  @UseGuards(PermissionGuard(AccessProfile.ADMIN_EMPLOYEE))
  @Delete(':id')
  async deleteTable(@Param('id') id: string) {
    return this.tablesService.remove(id);
  }
}
