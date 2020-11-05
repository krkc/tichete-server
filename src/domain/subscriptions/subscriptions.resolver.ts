import { Injectable } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './subscription.entity';
import { createBaseResolver } from '../../base/base.abstract-resolver';
import { NewSubscriptionInput } from './dto/new-subscription.input';

@Injectable()
@Resolver()
export class SubscriptionsResolver extends createBaseResolver(`${Subscription.name}s`, Subscription, NewSubscriptionInput) {
  constructor(
    public readonly service: SubscriptionsService
  ) {
    super(service);
  }
}
