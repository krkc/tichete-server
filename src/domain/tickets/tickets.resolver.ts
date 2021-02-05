import { Injectable } from '@nestjs/common';
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import * as DataLoader from 'dataloader';
import { Loader } from '../../decorators/loader.decorator';
import { TagLoader } from '../../dataloaders/tags.loader';
import { createBaseResolver } from '../../base/base.abstract-resolver';
import { Tag } from '../tags/tag.entity';
import { NewTicketInput } from './dto/new-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';
import { Assignment } from '../assignments/assignment.entity';
import { AssignmentLoader } from '../../dataloaders/assignments.loader';
import { PubSub } from 'apollo-server-express';
import { RequiredActions } from '../../decorators/required-actions.decorator';
import { Action } from '../../casl/casl-ability.factory';

const pubSub = new PubSub();

@Injectable()
@Resolver(() => Ticket)
export class TicketsResolver extends createBaseResolver(`${Ticket.name}s`, Ticket, NewTicketInput, UpdateTicketInput) {
  constructor(protected readonly service: TicketsService) {
    super(service);
  }

  // TODO: Seed an 'Everyone' role that does this.
  // /**
  //  * Non-administrator users can submit tickets, so
  //  * override the base implementation which contains
  //  * a role check.
  //  */
  // @Mutation(() => [Ticket])
  // async create(
  //   @Args('newTicketData', { type: () => [NewTicketInput] }) newTicketData: NewTicketInput[],
  // ) {
  //   const resources = this.service.create(newTicketData);
  //   pubSub.publish(`TicketAdded`, { resourceAdded: resources });
  //   return resources;
  // }

  @ResolveField(() => [Tag])
  async tags(
    @Parent() ticket: Ticket,
    @Loader({ relName: Tag.name, loaderName: TagLoader.name, data: { keyColumnName: 'ticketId' } }) tagLoader: DataLoader<Ticket['id'], Tag[]>
  ) {
    return await tagLoader.load(ticket.id);
  }

  @RequiredActions(Action.Read)
  @ResolveField(() => [Assignment])
  async assignments(
    @Parent() ticket: Ticket,
    @Loader({ relName: Assignment.name, loaderName: AssignmentLoader.name, data: { keyColumnName: 'ticketId' } }) assignmentLoader: DataLoader<Ticket['id'], Assignment[]>
  ) {
    return await assignmentLoader.load(ticket.id);
  }
}
