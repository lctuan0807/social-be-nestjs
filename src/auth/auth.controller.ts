import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserVo } from './vo/register-user.vo';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // register user endpoint -- auth/register
  @Post('register')
  async register(@Body() register: RegisterDto): Promise<{ message: string, data: RegisterUserVo }> {
    console.log("🚀 ~ AuthController ~ register ~ register:", register)
    const user = await this.authService.register(register);
    return { message: 'User registered successfully', data: user };
  }

  // login endpoint - auth/login
  @Post('login')
  async login(@Body() login: LoginDto): Promise<{ accessToken: string }> {
    console.log("🚀 ~ AuthController ~ login ~ login:", login)
    return this.authService.signIn(login);
  }
}
