import { Field, InputType, Int } from '@nestjs/graphql';
import { NewTagInput } from 'src/domain/tags/dto/new-tag.input';
import { Tag } from 'src/domain/tags/tag.entity';
import { Base } from '../../../base/base.abstract-entity';
import { Ticket } from '../ticket.entity';

@InputType()
export class UpdateTicketInput {
  @Field(() => Int)
  id!: number;
  description?: string;
  @Field(() => Int)
  creatorId?: number;
  @Field(() => Int)
  statusId?: number;
  @Field(() => [NewTagInput])
  taggedCategories?: NewTagInput[];
}
