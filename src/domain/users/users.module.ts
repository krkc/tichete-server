import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './user.entity';
import { RolesModule } from './roles/roles.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { AssignmentsModule } from '../assignments/assignments.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule, SubscriptionsModule, AssignmentsModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
