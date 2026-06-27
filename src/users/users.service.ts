import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private userRepository: Repository<User>;
  
  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });

    return user;
  }
}
