import { Injectable } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { Loader } from '../../decorators/loader.decorator';
import { TagLoader } from '../../dataloaders/tags.loader';
import { createBaseResolver } from '../../base/base.abstract-resolver';
import { Tag } from '../tags/tag.entity';
import { NewTicketInput } from './dto/new-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';

@Injectable()
@Resolver(() => Ticket)
export class TicketsResolver extends createBaseResolver(`${Ticket.name}s`, Ticket, NewTicketInput, UpdateTicketInput) {
  constructor(protected readonly service: TicketsService) {
    super(service);
  }

  @ResolveField()
  async tags(
    @Parent() ticket: Ticket,
    @Loader({ loaderName: TagLoader.name, data: { keyColumnName: 'ticketId' } }) tagLoader: DataLoader<Ticket['id'], Tag[]>
  ) {
    return await tagLoader.load(ticket.id);
  }
}
