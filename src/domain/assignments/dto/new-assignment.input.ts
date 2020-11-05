import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewAssignmentInput {
  @Field(() => Int)
  userId!: number;

  @Field(() => Int)
  ticketId!: number;
}
