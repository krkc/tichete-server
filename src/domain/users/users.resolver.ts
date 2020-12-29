import { Injectable } from '@nestjs/common';
import { Parent, ResolveField, Resolver, Query } from '@nestjs/graphql';
import { NewUserInput } from './dto/new-user.input';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { createBaseResolver } from '../../base/base.abstract-resolver';
import { UpdateUserInput } from './dto/update-user.input';
import { Assignment } from '../assignments/assignment.entity';
import { AssignmentLoader } from '../../dataloaders/assignments.loader';
import * as DataLoader from 'dataloader';
import { Loader } from '../../decorators/loader.decorator';
import { Subscription } from '../subscriptions/subscription.entity';
import { SubscriptionLoader } from '../../dataloaders/subscriptions.loader';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { RequiredActions } from '../../decorators/required-actions.decorator';
import { Action } from '../../casl/casl-ability.factory';

@Injectable()
@Resolver(() => User)
export class UsersResolver extends createBaseResolver(`${User.name}s`, User, NewUserInput, UpdateUserInput) {
  constructor(protected readonly service: UsersService) {
    super(service);
  }

  /**
   * Non-administrator users can get a user object that
   * represents themself, but without
   * the additional resolved relationships.
   * (Tags are fine)
   */
  @Query(() => User)
  async getMe(
    @CurrentUser() me: User,
  ) {
    return this.service.findOne(me.id);
  }

  @RequiredActions(Action.Read)
  @ResolveField(() => [Subscription])
  async subscriptions(
    @Parent() user: User,
    @Loader({ relName: Subscription.name, loaderName: SubscriptionLoader.name, data: { keyColumnName: 'userId' } }) subscriptionLoader: DataLoader<User['id'], Subscription[]>
  ) {
    return await subscriptionLoader.load(user.id);
  }

  @RequiredActions(Action.Read)
  @ResolveField(() => [Assignment])
  async assignments(
    @Parent() user: User,
    @Loader({ relName: Assignment.name, loaderName: AssignmentLoader.name, data: { keyColumnName: 'userId' } }) assignmentLoader: DataLoader<User['id'], Assignment[]>
  ) {
    return await assignmentLoader.load(user.id);
  }
}
