import { Optional } from '@nestjs/common';
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../roles/role.entity';

@InputType()
export class NewUserInput {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  username?: string;

  firstName?: string;

  lastName?: string;

  // @Optional()
  // role?: Role;
}
