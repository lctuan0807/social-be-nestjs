import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserVo } from './vo/register-user.vo';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  // register user endpoint -- auth/register
  @Post('register')
  async register(@Body() register: RegisterDto): Promise<{ message: string, data: RegisterUserVo }> {
    const data = await this.authService.register(register);
    return { message: 'User registered successfully', data };
  }
}
