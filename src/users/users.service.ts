
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail(id);
  }

  async create(user: CreateUserDto): Promise<User> {    
    return this.usersRepository.save(user);
  }

  async update(id: string, user: CreateUserDto): Promise<User> {    
    return this.usersRepository.save({ ...user, id: Number(id) });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.findOneOrFail(id);
    await this.usersRepository.delete(id);
  }
}