import { Injectable } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { NewUserInput } from './dto/new-user.input';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { createBaseResolver } from '../../base/base.abstract-resolver';
import { UpdateUserInput } from './dto/update-user.input';


@Injectable()
@Resolver()
export class UsersResolver extends createBaseResolver(`${User.name}s`, User, NewUserInput, UpdateUserInput) {
  constructor(protected readonly service: UsersService) {
    super(service);
  }
}
