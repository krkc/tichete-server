import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../base/base.abstract-service';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { UsersService } from '../users/users.service';
import { TicketsService } from '../tickets/tickets.service';
import { Ticket } from '../tickets/ticket.entity';
import { User } from '../users/user.entity';
import { NewUserAssignmentArgs } from './dto/new-user-assignment.args';
import { NewTicketAssignmentArgs } from './dto/new-ticket-assignment.args';
import { NewAssignmentInput } from './dto/new-assignment.input';

@Injectable()
export class AssignmentsService extends BaseService<Assignment> {
  constructor(
    @InjectRepository(Assignment) public repo: Repository<Assignment>,
    protected readonly usersService: UsersService,
    protected readonly ticketsService: TicketsService,
  ) {
    super(repo);
  }

  // async create(data: NewAssignmentInput[]): Promise<Assignment[]> {
  //   const newAssignments = data.map(d => this.repo.create(d));
  //   return this.repo.save(newAssignments);
  // }

  async assignTicketsToUser(newUserAssignmentInput: NewUserAssignmentArgs): Promise<User> {
    const newAssignments = [];
    newUserAssignmentInput.assignedTicketIds.forEach(ticketId => {
      newAssignments.push(this.repo.create({
        userId: newUserAssignmentInput.userId,
        ticketId
      }));
    });
    await this.repo.save(newAssignments);
    return this.usersService.findOne(newUserAssignmentInput.userId);
  }

  async unassignTicketsFromUser(assignmentIds: number[]): Promise<User> {
    const assignmentsToDelete = await this.repo.find({
      where: {
        id: assignmentIds
      }
    });
    const user = await this.usersService.findOne(assignmentsToDelete[0].userId);
    await this.repo.remove(assignmentsToDelete);

    return this.usersService.findOne(user.id);
  }

  async assignUsersToTicket(newUserAssignmentInput: NewTicketAssignmentArgs): Promise<Ticket> {
    return {} as any;
  }
}
