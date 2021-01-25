import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewTagInput {
  @Field(() => Int)
  ticketId?: number;

  @Field(() => Int)
  categoryId!: number;
}
