import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { RegisterUserVo } from './vo/register-user.vo';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private userRepository: Repository<User>;
  
  async register(registerDto: RegisterDto): Promise<RegisterUserVo> {
    const { username, email, password } = registerDto;
    console.log("🚀 ~ AuthService ~ register ~ username, email:", username, email)

    // check existing user
    const existingUser = await this.userRepository.findOne({
      where: { username, email }
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

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
}
