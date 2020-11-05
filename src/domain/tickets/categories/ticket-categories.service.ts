import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketCategoryDto } from './dto/ticket-category.dto';
import { TicketCategory } from './ticket-category.entity';
import { BaseService } from '../../../base/base.abstract-service';
import { NewCategoryInput } from './dto/new-category.input';

@Injectable()
export class TicketCategoriesService extends BaseService<TicketCategory> {
  constructor(
    @InjectRepository(TicketCategory) public repo: Repository<TicketCategory>,
  ) {
    super(repo);
  }

  // async create(data: NewCategoryInput): Promise<TicketCategory> {
  //   const newCategory = this.repo.create(data);
  //   return this.repo.save(newCategory);
  // }
}
