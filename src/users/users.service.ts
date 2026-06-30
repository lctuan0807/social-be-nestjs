import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { hashPasswordHelper } from 'src/utils/helper';
import { RegisterUserVo } from 'src/auth/vo/register-user.vo';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { OtpDto } from 'src/auth/dto/otp.dto';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private userRepository: Repository<User>;
  @Inject(RedisService)
  private readonly redisService: RedisService;

  constructor(private readonly emailService: EmailService) {}

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        email: true,
        isActive: true,
      },
    });

    return user;
  }

  async handleRegister(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    console.log(
      '🚀 ~ AuthService ~ register ~ username, email:',
      username,
      email,
    );

    // check existing user
    const existingUser = await this.userRepository.findOne({
      where: { username, email },
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
      console.log('🚀 ~ AuthService ~ register ~ savedUser:', savedUser);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('🚀 ~ UsersService ~ handleRegister ~ otp:', otp);
      await this.redisService.set(`otp:${newUser.id}`, otp, 5 * 60);

      // send email with OTP
      this.emailService.sendVerificationEmail(
        savedUser.email,
        savedUser.username,
        otp,
      );

      // response in VO
      const userVo = new RegisterUserVo();
      userVo.id = savedUser.id;
      userVo.username = savedUser.username;
      userVo.email = savedUser.email;
      userVo.createdAt = savedUser.createdAt;

      console.log('🚀 ~ AuthService ~ register ~ userVo:', userVo);
      return userVo;
    } catch (error) {
      console.error('Error saving user', error);
      throw new InternalServerErrorException(
        'An error occured while creating new user',
      );
    }
  }

  async handleActive(otpDto: OtpDto) {
    const otp = await this.redisService.get(`otp:${otpDto.id}`);
    const user = await this.userRepository.findOneBy({ id: otpDto.id });
    if (!user || !otp) {
      throw new BadRequestException('OTP is invalid or expired');
    }

    if (otp !== otpDto.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.isActive) {
      throw new BadRequestException('User is already active');
    }

    await this.userRepository.update(user.id, { isActive: true });

    console.log('🚀 ~ UsersService ~ handleActive ~ otp:', otpDto.otp);
    return otpDto;
  }
}
