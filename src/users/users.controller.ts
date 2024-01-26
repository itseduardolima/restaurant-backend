import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';
import { CreateClientDto } from './dto/create-client.dto';
import { PublicRoute } from 'src/common/decorator/public_route.decorator';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_EMPLOYEE))
  async getAll(
    @Query() searchType: QueryUserDto,
    @Query() paginationFilter: FilterWorkstation,
  ) {
    return this.userService.getAll(paginationFilter, searchType);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_EMPLOYEE))
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_EMPLOYEE))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @PublicRoute()
  @Post('/register-public')
  async registerPublic(@Body() createClientDto: CreateClientDto) {
    return this.userService.registerPublic(createClientDto);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
