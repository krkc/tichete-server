import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { BaseService } from '../../base/base.abstract-service';
import { NewTicketInput } from './dto/new-ticket.input';
import { Tag } from '../tags/tag.entity';
import { TagsService } from '../tags/tags.service';
import { Assignment } from '../assignments/assignment.entity';
import { AssignmentsService } from '../assignments/assignments.service';

@Injectable()
export class TicketsService extends BaseService<Ticket> {
  constructor(
    @InjectRepository(Ticket) public repo: Repository<Ticket>,
    private tagsService: TagsService,
    private assignmentsService: AssignmentsService,
  ) {
    super(repo);

    this.m2mRelationships[this.nameof<Ticket>('tags')] = {
      class: Tag,
      service: this.tagsService,
      srcIdColName: 'ticketId',
      relIdColName: 'categoryId',
    };
    this.m2mRelationships[this.nameof<Ticket>('assignments')] = {
      class: Assignment,
      service: this.assignmentsService,
      srcIdColName: 'ticketId',
      relIdColName: 'userId',
    };
  }

  async findAll(): Promise<Ticket[]> {
    return this.repo.find();
  }

  async create(newTicketInputs: NewTicketInput[]): Promise<Ticket[]> {
    const newTickets = [];
    for (const newTicketInput of newTicketInputs) {
      const categoryIds = newTicketInput.ticketCategoryIds;
      delete newTicketInput.ticketCategoryIds;
      const newTicket = await this.repo.save(this.repo.create(newTicketInput));
      const tags = categoryIds.map(categoryId => new Tag({ ticketId: newTicket.id, categoryId }));
      newTicket.tags = Promise.resolve(tags);
      newTickets.push(newTicket);
    }

    return this.repo.save(newTickets);
  }
}
