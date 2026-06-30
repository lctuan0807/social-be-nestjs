import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { RegisterUserVo } from './vo/register-user.vo';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { comparePasswordHelper, hashPasswordHelper } from 'src/utils/helper';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserVo } from './vo/user.vo';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterUserVo> {
    return this.usersService.handleRegister(registerDto);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };

    const userVo = new UserVo();
    userVo.id = user.id;
    userVo.username = user.username;
    userVo.email = user.email;

    return {
      user: userVo,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) return null;

    const isValidPassword = await comparePasswordHelper(
      password,
      user.password,
    );

    if (!isValidPassword) return null;

    return user;
  }
}
