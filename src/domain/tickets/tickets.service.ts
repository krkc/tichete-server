import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, In, Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { BaseService } from '../../base/base.abstract-service';
import { NewTicketInput } from './dto/new-ticket.input';
import { Tag } from '../tags/tag.entity';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class TicketsService extends BaseService<Ticket> {
  constructor(
    @InjectRepository(Ticket) public repo: Repository<Ticket>,
    private tagsService: TagsService
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
    const tags = await newTicket.tags;
    tags.push(...categoryIds.map(categoryId => new Tag({ ticketId: newTicket.id, categoryId })));
    newTicket.tags = Promise.resolve(tags);
    return this.repo.save([newTicket]);
  }

  async update(data: UpdateTicketInput[]): Promise<Ticket[]> {
    const relationships = ['tags'];
    const resources: Ticket[] = [];

    for (const datum of data) {
      const resource = await this.repo.findOne(datum.id, { relations: relationships });
      if (!resource) throw new NotFoundException();

      const resourceWithRelationships = await this.resolveRelationships(resource, datum, relationships);
      resources.push(resourceWithRelationships || resource);
    }

    return await this.repo.save(resources);
  }

  protected async resolveRelationships(resource: Ticket, updateInputData: UpdateTicketInput, relationships: string[]) {
    // https://github.com/typeorm/typeorm/issues/2121
    const tagsToRemove = await this.tagsService.repo.find({
      ticketId: updateInputData.id,
      categoryId: Not(In(updateInputData.tags.map(tag => tag.categoryId)))
    });
    await this.tagsService.repo.remove(tagsToRemove);

    resource.tags = Promise.resolve(updateInputData.tags.map(t => {
      // https://github.com/typeorm/typeorm/issues/7038
      t.ticketId = t.ticketId ?? undefined;
      t.categoryId = t.categoryId ?? undefined;
      return t;
    }) as any);
    for (const propertyName in updateInputData) {
      if (Object.prototype.hasOwnProperty.call(updateInputData, propertyName)) {
        const property = updateInputData[propertyName];
        if (relationships.find(relationName => relationName === propertyName)) continue;

        resource[propertyName] = property;
      }
    }

    return resource;
  }
}
