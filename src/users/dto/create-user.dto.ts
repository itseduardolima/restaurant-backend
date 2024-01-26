import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class CreateUserDto extends OmitType(UserEntity, [
  'user_id',
  'user_status',
  'userCreatedDate',
  'userUpdateDate',
  'user_refresh_token',
  'profile'
]) {
  @ApiProperty()
  user_name: string;

  @ApiProperty()
  user_email: string;

  @ApiProperty()
  user_password: string;

  @ApiProperty()
  user_phone: string;

  @ApiProperty()
  user_profile: number;
}
