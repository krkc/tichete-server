import { Field, InputType, Int } from '@nestjs/graphql';
import { UpdateAssignmentInput } from '../../assignments/dto/update-assignment.input';
import { UpdateTagInput } from '../../tags/dto/update-tag.input';

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
  @Field(() => [UpdateAssignmentInput])
  assignments?: UpdateAssignmentInput[];
}
