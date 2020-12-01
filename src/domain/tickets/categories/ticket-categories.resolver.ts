import { TicketCategory } from './ticket-category.entity';
import { TicketCategoriesService } from './ticket-categories.service';
import { createBaseResolver } from '../../../base/base.abstract-resolver';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import * as DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';
import { NewCategoryInput } from './dto/new-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { TagLoader } from '../../../dataloaders/tags.loader';
import { Loader } from '../../../decorators/loader.decorator';
import { Tag } from '../../../domain/tags/tag.entity';

@Injectable()
@Resolver(() => TicketCategory)
export class TicketCategoriesResolver extends createBaseResolver('TicketCategories', TicketCategory, NewCategoryInput, UpdateCategoryInput) {
  constructor(public readonly service: TicketCategoriesService) {
    super(service);
  }

  @ResolveField(() => [Tag])
  async taggedTickets(
    @Parent() ticketCategory: TicketCategory,
    @Loader({ relName: Tag.name, loaderName: TagLoader.name, data: { keyColumnName: 'categoryId' } }) tagLoader: DataLoader<TicketCategory['id'], Tag[]>
  ) {
    return await tagLoader.load(ticketCategory.id);
  }
}
