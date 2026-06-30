import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserVo } from './vo/register-user.vo';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public, ResponseMessage } from 'src/decorators/custom';
import { EmailService } from 'src/email/email.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // register user endpoint -- auth/register
  @Post('register')
  @Public() // public endpoint - pass jwt auth guard
  async register(
    @Body() register: RegisterDto,
  ): Promise<{ message: string; data: RegisterUserVo }> {
    console.log('🚀 ~ AuthController ~ register ~ register:', register);
    const user = await this.authService.register(register);
    return { message: 'User registered successfully', data: user };
  }

  // login endpoint - auth/login
  @Post('login')
  @Public() // public endpoint - pass jwt auth guard
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Fetch login')
  login(@Request() req) {
    console.log('🚀 ~ AuthController ~ login ~ req.user:', req.user);
    return this.authService.login(req.user);
  }

  // auth/me
  // @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    console.log('🚀 ~ AuthController ~ getProfile ~ req:', req.user);
    return req.user;
  }
}
