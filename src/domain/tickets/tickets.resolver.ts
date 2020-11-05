import { Injectable } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { createBaseResolver } from '../../base/base.abstract-resolver';
import { Roles } from '../../decorators/roles.decorator';
import { NewTicketInput } from './dto/new-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';


@Injectable()
@Resolver()
export class TicketsResolver extends createBaseResolver(`${Ticket.name}s`, Ticket, NewTicketInput) {
  constructor(protected readonly service: TicketsService) {
    super(service);
  }

  @Roles('Administrator')
    @Mutation(() => Ticket, { name: `updateTicket` })
    async update(
      @Args(`updateTicketData`, { type: () => UpdateTicketInput}) updateTicketData: UpdateTicketInput,
    ): Promise<Ticket> {
      const resource = await this.service.update(updateTicketData);
      return resource as any as Ticket;
    }
}
