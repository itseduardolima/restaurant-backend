import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UpdateUserDto extends OmitType(UserEntity, [
  'user_id',
  'user_status',
  'userCreatedDate',
  'userUpdateDate',
  'user_password'
]) {
  @ApiProperty()
  user_name: string;

  @ApiProperty()
  user_email: string;

  @ApiProperty()
  user_phone: string;

  @ApiProperty()
  user_profile: number;
}
