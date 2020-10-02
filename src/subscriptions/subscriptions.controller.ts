import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { SubscriptionDto } from './dto/subscription.dto';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './subscription.entity';
import { BaseController } from '../base/base.abstract-controller';

@Crud({
  model: {
    type: SubscriptionDto,
  },
  routes: BaseController.routesOptions
})
@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController implements BaseController<Subscription> {
  constructor(
    public readonly service: SubscriptionsService
  ) {}
}
