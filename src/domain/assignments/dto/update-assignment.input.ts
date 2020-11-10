import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateAssignmentInput {
  @Field(() => Int)
  id?: number;

  @Field(() => Int)
  userId!: number;

  @Field(() => Int)
  ticketId!: number;
}
