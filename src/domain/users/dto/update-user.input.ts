import { Optional } from '@nestjs/common';
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../roles/role.entity';

@InputType()
export class UpdateUserInput {
  id: number;

  @IsEmail()
  email: string;

  username?: string;

  password?: string;

  firstName?: string;

  lastName?: string;
}
