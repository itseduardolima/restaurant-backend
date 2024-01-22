import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ProfileEntity } from '../entities/profile.entity';

export class CreateProfileDto extends OmitType(ProfileEntity, ['profile_id']) {
  @ApiProperty()
  profile_name: string;
}
