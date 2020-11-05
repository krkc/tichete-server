import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class NewTicketAssignmentArgs {
  @Field(() => Int)
  ticketId!: number;

  @Field(() => [Int])
  assignedUserIds: number[];
}
