import { Field, InputType, Int } from '@nestjs/graphql';
import { UpdateTagInput } from '../../../domain/tags/dto/update-tag.input';

@InputType()
export class UpdateTicketInput {
  @Field(() => Int)
  id!: number;
  description?: string;
  @Field(() => Int)
  creatorId?: number;
  @Field(() => Int)
  statusId?: number;
  @Field(() => [UpdateTagInput])
  tags?: UpdateTagInput[];
}
