import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { UpdateSubscriptionInput } from 'src/domain/subscriptions/dto/update-subscription.input';

@InputType()
export class UpdateUserInput {
  id: number;

  @IsEmail()
  email?: string;

  username?: string;

  password?: string;

  firstName?: string;

  lastName?: string;

  @Field(() => Int)
  roleId?: number;

  @Field(() => [UpdateSubscriptionInput])
  subscriptions? : UpdateSubscriptionInput[];
}
