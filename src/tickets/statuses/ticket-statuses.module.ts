import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketStatus } from './ticket-status.entity';
import { TicketStatusesController } from './ticket-statuses.controller';
import { TicketStatusesService } from './ticket-statuses.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketStatus])],
  providers: [TicketStatusesService],
  exports: [TicketStatusesService],
  controllers: [TicketStatusesController],
})
export class TicketStatusesModule {}
