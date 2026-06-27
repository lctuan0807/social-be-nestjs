import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { RegisterUserVo } from './vo/register-user.vo';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { comparePasswordHelper, hashPasswordHelper } from 'src/utils/helper';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  
  async register(registerDto: RegisterDto): Promise<RegisterUserVo> {
    const { username, email, password } = registerDto;
    console.log("🚀 ~ AuthService ~ register ~ username, email:", username, email)

    // check existing user
    const existingUser = await this.userRepository.findOne({
      where: { username, email }
    });

    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }

    // hash password
    const hashedPassword = await hashPasswordHelper(password);

    // create new user
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    try {
      // save new user
      const savedUser = await this.userRepository.save(newUser);
      console.log("🚀 ~ AuthService ~ register ~ savedUser:", savedUser)

      // response in VO
      const userVo = new RegisterUserVo();
      userVo.id = savedUser.id;
      userVo.username = savedUser.username;
      userVo.email = savedUser.email;
      userVo.createdAt = savedUser.createdAt;

      console.log("🚀 ~ AuthService ~ register ~ userVo:", userVo)
      return userVo;
    } catch (error) {
      console.error("Error saving user", error);
      throw new InternalServerErrorException("An error occured while creating new user");
    }
  }
  
  async signIn(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isValidPassword = await comparePasswordHelper(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    console.log("🚀 ~ AuthService ~ signIn ~ accessToken:", accessToken)
    
    return { accessToken };
  }
}
