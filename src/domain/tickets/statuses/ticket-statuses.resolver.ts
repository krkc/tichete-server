import { Injectable } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from '../../../base/base.abstract-resolver';
import { NewTicketStatusInput } from './dto/new-ticket-status.input';
import { UpdateTicketStatusInput } from './dto/update-ticket-status.input';
import { TicketStatus } from './ticket-status.entity';
import { TicketStatusesService } from './ticket-statuses.service';


@Injectable()
@Resolver()
export class TicketStatusesResolver extends createBaseResolver('TicketStatuses', TicketStatus, NewTicketStatusInput, UpdateTicketStatusInput) {
  constructor(public readonly service: TicketStatusesService) {
    super(service);
  }
}
