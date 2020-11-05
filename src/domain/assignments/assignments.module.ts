import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsResolver } from './assignments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './assignment.entity';
import { UsersModule } from '../users/users.module';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment]), UsersModule, TicketsModule
],
  providers: [AssignmentsService, AssignmentsResolver],
})
export class AssignmentsModule {}
