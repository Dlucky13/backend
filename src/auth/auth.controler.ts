import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
@Controller('auth')

export class AuthController {
  constructor(private authService: AuthService) {

  }

  @Post('login')
  private login() {
    return this.authService.login();
  }

  @Post('signup')
  private signup() {
    return this.authService.signup();
  }

}