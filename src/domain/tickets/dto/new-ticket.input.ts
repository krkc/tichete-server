import { Field, InputType, Int } from '@nestjs/graphql';
import { UpdateAssignmentInput } from '../../assignments/dto/update-assignment.input';
import { NewTagInput } from '../../tags/dto/new-tag.input';

@InputType()
export class NewTicketInput {
  description?: string;
  @Field(() => Int)
  creatorId?: number;
  @Field(() => Int)
  statusId?: number;
  @Field(() => [NewTagInput])
  tags?: NewTagInput[];
  @Field(() => [UpdateAssignmentInput])
  assignments?: UpdateAssignmentInput[];
}
