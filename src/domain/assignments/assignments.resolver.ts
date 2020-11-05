import { Injectable } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './assignment.entity';
import { createBaseResolver } from '../../base/base.abstract-resolver';
import { UsersService } from '../users/users.service';
import { TicketsService } from '../tickets/tickets.service';
import { Ticket } from '../tickets/ticket.entity';
import { Roles } from '../../decorators/roles.decorator';
import { NewUserAssignmentArgs } from './dto/new-user-assignment.args';
import { User } from '../users/user.entity';
import { NewTicketAssignmentArgs } from './dto/new-ticket-assignment.args';
import { NewAssignmentInput } from './dto/new-assignment.input';

const pubSub = new PubSub();

@Injectable()
@Resolver()
export class AssignmentsResolver extends createBaseResolver(`${Assignment.name}s`, Assignment, NewAssignmentInput) {
  constructor(
    protected readonly service: AssignmentsService
  ) {
    super(service);
  }

  @Roles('Administrator')
  @Mutation(() => User)
  async assignTicketsToUser(
    @Args() newUserAssignmentData: NewUserAssignmentArgs,
  ): Promise<User> {
    const userAssignment = await this.service.assignTicketsToUser(newUserAssignmentData);
    pubSub.publish('userAssignmentAdded', { userAssignmentAdded: userAssignment });
    return userAssignment;
  }

  @Roles('Administrator')
  @Mutation(() => User)
  async unassignTicketsFromUser(
    @Args('assignmentIds', {type: () => [Int]}) assignmentIds: number[],
  ): Promise<User> {
    const userAssignment = await this.service.unassignTicketsFromUser(assignmentIds);
    pubSub.publish('userAssignmentRemoved', { userAssignmentRemoved: userAssignment });
    return userAssignment;
  }

  @Roles('Administrator')
  @Mutation(() => Ticket)
  async assignUsersToTicket(
    @Args() newTicketAssignmentData: NewTicketAssignmentArgs,
  ): Promise<Ticket> {
    const ticketAssignment = await this.service.assignUsersToTicket(newTicketAssignmentData);
    pubSub.publish('ticketAssignmentAdded', { ticketAssignmentAdded: ticketAssignment });
    return ticketAssignment;
  }

  @Roles('Administrator')
  @Mutation(() => Ticket)
  async unassignUsersFromTicket(
    @Args() newTicketAssignmentData: NewTicketAssignmentArgs,
  ): Promise<Ticket> {
    const ticketAssignment = await this.service.assignUsersToTicket(newTicketAssignmentData);
    pubSub.publish('ticketAssignmentRemoved', { ticketAssignmentRemoved: ticketAssignment });
    return ticketAssignment;
  }

  // @Query(result => [Ticket])
  // protected async availableTickets(@Args('ticketId') ticketId: number): Promise<Ticket[]> {
  //   return this.service.getAvailableTicketsForUser(ticketId);
  // }
}
