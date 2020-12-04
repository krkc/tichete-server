import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, ModuleRef } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataLoaderInterceptor } from '../../interceptors/nest-data-loader.interceptor';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsResolver } from './subscriptions.resolver';
import { Subscription } from './subscription.entity';
import { SubscriptionLoader } from '../../dataloaders/subscriptions.loader';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])
],
  providers: [
    SubscriptionsService,
    SubscriptionsResolver,
    SubscriptionLoader,
    {
      provide: APP_INTERCEPTOR,
      useFactory: (moduleRef: ModuleRef) => new DataLoaderInterceptor(moduleRef, Subscription.name),
      inject: [ModuleRef]
    },
  ],
  exports: [SubscriptionsService]
})
export class SubscriptionsModule {}
