import { Injectable } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { NewUserInput } from './dto/new-user.input';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { createBaseResolver } from '../../base/base.abstract-resolver';
import { UpdateUserInput } from './dto/update-user.input';
import { Assignment } from '../assignments/assignment.entity';
import { AssignmentLoader } from '../../dataloaders/assignments.loader';
import * as DataLoader from 'dataloader';
import { Loader } from '../../decorators/loader.decorator';

@Injectable()
@Resolver(() => User)
export class UsersResolver extends createBaseResolver(`${User.name}s`, User, NewUserInput, UpdateUserInput) {
  constructor(protected readonly service: UsersService) {
    super(service);
  }

  @ResolveField(() => [Assignment])
  async assignments(
    @Parent() user: User,
    @Loader({ relName: Assignment.name, loaderName: AssignmentLoader.name, data: { keyColumnName: 'userId' } }) assignmentLoader: DataLoader<User['id'], Assignment[]>
  ) {
    return await assignmentLoader.load(user.id);
  }
}
