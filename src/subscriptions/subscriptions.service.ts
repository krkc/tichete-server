import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.abstract-service';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionsService extends BaseService<Subscription> {
  constructor(
    @InjectRepository(Subscription) public repo: Repository<Subscription>
  ) {
    super(repo);
  }
}
