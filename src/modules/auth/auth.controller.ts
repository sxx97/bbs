import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AccountDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  login(@Body() data: AccountDto) {
    return this.authService.login(data.account, data.password);
  }

  @Post('register')
  register() {}
}
