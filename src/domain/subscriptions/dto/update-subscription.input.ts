import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateSubscriptionInput {
  id?: number;
  userId!: number;
  categoryId!: number;
}
