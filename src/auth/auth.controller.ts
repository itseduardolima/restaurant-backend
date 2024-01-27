import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { LoginDTO } from './dto/login.dto';
import { AuthService } from './shared/auth.service';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './shared/guards/jwt.refresh-auth.guard';
import { LocalAuthGuard } from './shared/guards/local-auth.guard';
import { PublicRoute } from 'src/common/decorator/public_route.decorator';

@ApiTags('Login')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @PublicRoute()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ description: '## Route to login - [Public]' })
  @ApiBody({
    type: LoginDTO,
  })
  async auth(@Body() auth: LoginDTO) {
    return this.authService.login(auth);
  }

  @Post('/logout')
  @ApiBearerAuth()
  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard)
  async logout(@Request() payload: any) {
    return this.authService.removeRefreshToken(payload.user.sub);
  }

  @Post('/refresh_token')
  @ApiBearerAuth()
  @PublicRoute()
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@Request() payload: any) {
    return this.authService.refreshToken(
      payload.user.id,
      payload.user.refresh_token,
    );
  }

  @Post('/validate')
  @ApiBearerAuth()
  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard)
  validateToken(@Request() req): any {
    return { userId: req.user.sub, name: req.user.name };
  }
}
