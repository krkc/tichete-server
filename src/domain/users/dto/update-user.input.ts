import { Optional } from '@nestjs/common';
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../roles/role.entity';

@InputType()
export class UpdateUserInput {
  id: number;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @Optional()
  firstName?: string;

  @Optional()
  lastName?: string;
}
