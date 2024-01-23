import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { Repository } from 'typeorm';
import { LoginDTO } from '../dto/login.dto';
import { hash, isMatchHash } from 'src/common/utils/hash';
import Tokens from 'src/common/interfaces/tokens';
import { UserService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser(userEmail: string, userPassword: string) {
    const user = await this.userService.findByEmail(userEmail);

    if (!user) {
      throw new NotFoundException('User do not exist');
    }

    const checkPass = bcrypt.compareSync(userPassword, user.user_password);

    if (user && checkPass) {
      return user;
    }

    return null;
  }

  async login(user: LoginDTO) {
    const userSaved = await this.userService.findByEmail(user.email);

    if (!userSaved || userSaved.user_status === false) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return await this.generateAndReturnTokens(userSaved);
  }

  async generateAndReturnTokens(userSaved: UserEntity) {
    const { access_token, refresh_token } = await this.getTokens(
      userSaved.user_id,
      userSaved.user_name,
      userSaved.user_profile,
    );

    const hashed_refresh_token = await hash(refresh_token);
    await this.userService.updateRefreshToken(
      userSaved.user_id,
      hashed_refresh_token,
    );

    return {
      access_token: access_token,
      refresh_token: refresh_token,
      name: userSaved.user_name,
      login: userSaved.user_email,
      profile: userSaved.profile.profile_name,
      expires_in: this.configService.get('auth.token_expires_in'),
    };
  }

  async refreshToken(id: string, refreshToken: string) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: id,
      },
    });

    if (!user) {
      throw new HttpException(
        'User with this enrollment does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.user_refresh_token) {
      throw new HttpException(
        'Refresh token does not exist on this user',
        HttpStatus.NOT_FOUND,
      );
    }

    const verifyIfMatchHash = await isMatchHash(
      refreshToken,
      user.user_refresh_token,
    );

    if (!verifyIfMatchHash) {
      throw new HttpException(
        'User with this enrollment does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const { access_token, refresh_token } = await this.getTokens(
      user.user_id,
      user.user_name,
      user.user_profile,
    );

    const hashed_refresh_token = await hash(refresh_token);

    const expiration = await this.configService.get(
      'auth.refresh_token_expires_in',
    );

    await this.userService.updateRefreshToken(
      user.user_id,
      hashed_refresh_token,
    );

    return {
      access_token: access_token,
      refresh_token: refresh_token,
      name: user.user_name,
      profile: user.user_profile,
      expires_in: expiration,
    };
  }

  async removeRefreshToken(id: string): Promise<any> {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new HttpException(
        'User with this enrollment does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getTokens(
    id: string,
    name: string,
    profile_id: number,
  ): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          name: name,
          profile: profile_id,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES_IN,
          algorithm: 'HS256',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
        },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
          algorithm: 'HS256',
        },
      ),
    ]);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }
}
