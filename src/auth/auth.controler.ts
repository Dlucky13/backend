import { Body, Controller, ParseIntPipe, Post } from '@nestjs/common';
import { AuthDto } from 'src/network/dto';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  private login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Post('signup')
  private signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
}
