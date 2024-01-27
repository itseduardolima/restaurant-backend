import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';

@ApiTags('profile')
@Controller('profile')
@ApiBearerAuth()

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }
  
}
