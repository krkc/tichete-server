import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { TicketCategoryDto } from '../../tickets/categories/dto/ticket-category.dto';
import { TicketDto } from '../../tickets/dto/ticket.dto';
import { RoleDto } from '../roles/dto/role.dto';

@ObjectType()
export class UserDto {
  id: number;
  firstName!: string;
  lastName!: string;

  @IsEmail()
  email: string;

  @Exclude()
  @HideField()
  password!: string;

  // @Exclude()
  role: RoleDto;

  // @Exclude()
  // submittedTickets: TicketDto[];

  // @Exclude()
  // assignedTickets: TicketDto[];

  // @Exclude()
  // subscriptions: TicketCategoryDto[];

  accessToken!: string;
}
