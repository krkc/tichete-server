import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { UpdateAssignmentInput } from '../../assignments/dto/update-assignment.input';
import { UpdateSubscriptionInput } from '../../subscriptions/dto/update-subscription.input';

@InputType()
export class UpdateUserInput {
  id: number;

  @IsEmail()
  email?: string;

  username?: string;

  password?: string;

  firstName?: string;

  lastName?: string;

  @Field(() => Int, { defaultValue: null })
  roleId?: number;

  @Field(() => [UpdateAssignmentInput])
  assignments?: UpdateAssignmentInput[];

  @Field(() => [UpdateSubscriptionInput])
  subscriptions? : UpdateSubscriptionInput[];
}
