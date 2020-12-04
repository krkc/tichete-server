import { Injectable } from '@nestjs/common';
import { Subscription } from '../domain/subscriptions/subscription.entity';
import { SubscriptionsService } from '../domain/subscriptions/subscriptions.service';
import { BaseLoader } from './base.loader';

@Injectable()
export class SubscriptionLoader extends BaseLoader<Subscription> {
  constructor(subscriptionService: SubscriptionsService) {
    super(subscriptionService);
  }
}
