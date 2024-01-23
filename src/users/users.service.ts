import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { FilterWorkstation } from 'src/common/utils/filterwork.dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
  ) {}

  async getAll(PaginationFilter: FilterWorkstation, search: QueryUserDto) {
    const { search_name } = search;

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile');

    if (search_name) {
      query.andWhere(
        new Brackets((queryBuilderOne) => {
          queryBuilderOne
            .where('user.users_name like :user_name', {
              user_name: `${search_name}%`,
            })
            .orWhere('profile.profile_name like :user_profile', {
              user_profile: `${search_name}%`,
            });
        }),
      );
    }

    return paginate<UserEntity>(query, PaginationFilter);
  }

  async findById(id: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.user_id = :user_id', { user_id: id })
      .getOne();
  }

  async findProfileById(id: number) {
    return this.profileRepository.findOne({
      where: {
        profile_id: id,
      },
    });
  }

  async findByEmail(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.user_email = :user_email', { user_email: email })
      .getOne();
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { user_name, user_password, user_email, user_phone, user_profile } = createUserDto;

    const hashedPassword = await this.hashPassword(user_password);
    const newUser = this.userRepository.create({
      user_name,
      user_password: hashedPassword,
      user_email,
      user_phone,
      user_profile,
    });

    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new BadRequestException('Erro ao criar o usuário', error.message);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findById(id);
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async updateRefreshToken(id: string, refresh_token: string) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: id,
      },
    });

    if (!user) {
      throw new NotFoundException(`user with id ${id} does not exist`);
    }

    user.user_refresh_token = refresh_token;

    await this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }
}
