import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './user.entity';
import { BaseService } from '../base/base.abstract-service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    public repo: Repository<User>  ) {
    super(repo)
  }

  async isPasswordCorrect(userId: number, plainPassword: string): Promise<boolean> {
    const user = await this.repo.findOne(userId);
    if (!user) throw new NotFoundException();

    return argon2.verify(user.password, plainPassword);
  }
}
