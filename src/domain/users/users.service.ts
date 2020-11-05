import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './user.entity';
import { BaseService } from '../../base/base.abstract-service';
import { UsersArgs } from './dto/users.args';
import { NewUserInput } from './dto/new-user.input';
import { Ticket } from '../tickets/ticket.entity';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    public repo: Repository<User>  ) {
    super(repo)
  }

  // async create(data: NewUserInput): Promise<User> {
  //   return await this.repo.save(this.repo.create(data));
  // }

  async findAll(usersArgs: UsersArgs): Promise<User[]> {
    return this.repo.find();
  }

  async isPasswordCorrect(userId: number, plainPassword: string): Promise<boolean> {
    const user = await this.repo.findOne(userId, { select: ['password'] });
    if (!user) throw new NotFoundException();

    return argon2.verify(user.password, plainPassword);
  }
}
