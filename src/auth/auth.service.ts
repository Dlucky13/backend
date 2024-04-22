import { Injectable } from "@nestjs/common";

@Injectable()

export class AuthService {

  login() {
    return 'hello you try to login';
  }

  signup() {
    return 'hello you try to register';
  }

}