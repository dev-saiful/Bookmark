import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authdto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  login(@Body() dto: Authdto) {
    return this.authService.login(dto);
  }
  @Post('register')
  register(@Body() dto: Authdto) {
    return this.authService.register(dto);
  }
}
