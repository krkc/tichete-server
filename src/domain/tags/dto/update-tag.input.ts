import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateTagInput {
  @Field(() => Int)
  id?: number;

  @Field(() => Int)
  ticketId!: number;

  @Field(() => Int)
  categoryId!: number;
}
