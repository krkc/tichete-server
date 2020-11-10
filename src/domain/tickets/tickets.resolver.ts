import { Injectable } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from '../../base/base.abstract-resolver';
import { NewTicketInput } from './dto/new-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';


@Injectable()
@Resolver()
export class TicketsResolver extends createBaseResolver(`${Ticket.name}s`, Ticket, NewTicketInput, UpdateTicketInput) {
  constructor(protected readonly service: TicketsService) {
    super(service);
  }
}
