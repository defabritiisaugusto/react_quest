import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterBodyDto } from './dto/register.dto';
import { LoginBodyDto } from './dto/login.dto';
import { RefreshBodyDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterBodyDto) {
    return this.auth.register(dto.username, dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginBodyDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshBodyDto) {
    return this.auth.refresh(dto.refreshToken);
  }
}
