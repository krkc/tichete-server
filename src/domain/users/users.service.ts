import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './user.entity';
import { BaseService } from '../../base/base.abstract-service';
import { Subscription } from '../subscriptions/subscription.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Assignment } from '../assignments/assignment.entity';
import { AssignmentsService } from '../assignments/assignments.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User) public repo: Repository<User>,
    private subscriptionsService: SubscriptionsService,
    private assignmentsService: AssignmentsService,
  ) {
    super(repo)

    this.m2mRelationships[this.nameof<User>('subscriptions')] = {
      class: Subscription,
      service: this.subscriptionsService,
      srcIdColName: 'userId',
      relIdColName: 'categoryId',
    };

    this.m2mRelationships[this.nameof<User>('assignments')] = {
      class: Assignment,
      service: this.assignmentsService,
      srcIdColName: 'userId',
      relIdColName: 'ticketId',
    };
  }

  async isPasswordCorrect(userId: number, plainPassword: string): Promise<boolean> {
    const user = await this.repo.findOne(userId, { select: ['password'] });
    if (!user) throw new NotFoundException();

    return argon2.verify(user.password, plainPassword);
  }
}
