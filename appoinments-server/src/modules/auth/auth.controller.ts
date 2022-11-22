import { Controller, Body, Post, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() user: any) {
    const userData = await this.service.login(user.phone, user.password);

    if (userData) return userData;
    else throw new HttpException('Username or password is incorrect', HttpStatus.BAD_REQUEST);
  }
}
