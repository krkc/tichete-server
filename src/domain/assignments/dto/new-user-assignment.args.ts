import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class NewUserAssignmentArgs {
  @Field(() => Int)
  userId!: number;

  @Field(() => [Int])
  assignedTicketIds: number[];
}
