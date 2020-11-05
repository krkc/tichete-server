import { InputType } from '@nestjs/graphql';

@InputType()
export class NewSubscriptionInput {
  userId!: number;
  categoryId!: number;
}
