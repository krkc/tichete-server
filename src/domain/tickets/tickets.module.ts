import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsModule } from '../assignments/assignments.module';
import { TagsModule } from '../tags/tags.module';
import { TicketCategoriesModule } from './categories/ticket-categories.module';
import { TicketStatusesModule } from './statuses/ticket-statuses.module';
import { Ticket } from './ticket.entity';
import { TicketsResolver } from './tickets.resolver';
import { TicketsService } from './tickets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), TicketStatusesModule, TicketCategoriesModule, TagsModule, AssignmentsModule],
  providers: [TicketsService, TicketsResolver],
  exports: [TicketsService],
})
export class TicketsModule {}
