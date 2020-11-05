import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { BaseService } from '../../base/base.abstract-service';
import { NewTicketInput } from './dto/new-ticket.input';
import { Tag } from '../tags/tag.entity';
import { UpdateTicketInput } from './dto/update-ticket.input';

@Injectable()
export class TicketsService extends BaseService<Ticket> {
  constructor(
    @InjectRepository(Ticket) public repo: Repository<Ticket>
  ) {
    super(repo);
  }

  async findAll(): Promise<Ticket[]> {
    return this.repo.find();
  }

  async create(data: NewTicketInput[]): Promise<Ticket[]> {
    const datum = data[0]; // TODO: figure out how to make this like the base version
    const categoryIds = datum.ticketCategoryIds;
    delete datum.ticketCategoryIds;
    const newTicket = await this.repo.save(this.repo.create(datum));
    const taggedCategories = await newTicket.tags;
    taggedCategories.push(...categoryIds.map(categoryId => new Tag({ ticketId: newTicket.id, categoryId })));
    return this.repo.save([newTicket]);
  }

  async update(data: UpdateTicketInput): Promise<Ticket> {
    const resource = await this.repo.findOne(data.id);
    if (!resource) throw new NotFoundException();

    if (data.taggedCategories) {
      const taggedCategories = await resource.tags;
      taggedCategories.push(...data.taggedCategories as Tag[]);
    }

    return this.repo.save(resource);
  }
}
