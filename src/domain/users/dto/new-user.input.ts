import { InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class NewUserInput {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  username?: string;

  firstName?: string;

  lastName?: string;

  roleId?: number;
}
