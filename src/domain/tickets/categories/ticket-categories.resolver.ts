import { TicketCategory } from './ticket-category.entity';
import { TicketCategoriesService } from './ticket-categories.service';
import { createBaseResolver } from '../../../base/base.abstract-resolver';
import { Resolver } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { NewCategoryInput } from './dto/new-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';


@Injectable()
@Resolver()
export class TicketCategoriesResolver extends createBaseResolver('TicketCategories', TicketCategory, NewCategoryInput, UpdateCategoryInput) {
  constructor(public readonly service: TicketCategoriesService) {
    super(service);
  }
}
