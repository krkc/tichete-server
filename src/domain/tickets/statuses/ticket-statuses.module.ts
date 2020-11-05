import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketStatus } from './ticket-status.entity';
import { TicketStatusesResolver } from './ticket-statuses.resolver';
import { TicketStatusesService } from './ticket-statuses.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketStatus])],
  providers: [TicketStatusesService, TicketStatusesResolver],
  exports: [TicketStatusesService],
})
export class TicketStatusesModule {}
