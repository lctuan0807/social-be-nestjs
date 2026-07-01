import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('🚀 ~ LocalStrategy ~ validate ~ email:', email);
    console.log('🚀 ~ LocalStrategy ~ validate ~ password:', password);
    const user = await this.authService.validateUser(email, password);
    console.log('🚀 ~ LocalStrategy ~ validate ~ user:', user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new BadRequestException('User is not activated');
    }

    return user;
  }
}
