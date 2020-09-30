import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { TicketCategoryDto } from '../../tickets/categories/dto/ticket-category.dto';
import { TicketDto } from '../../tickets/dto/ticket.dto';
import { RoleDto } from '../roles/dto/role.dto';

export class UserDto {
  id: number;
  firstName: string;
  lastName: string;

  @IsEmail()
  email: string;

  @Exclude()
  @ApiHideProperty()
  password: string;

  @Exclude()
  @ApiHideProperty()
  role: RoleDto;

  submittedTickets: TicketDto[];

  subscriptions: TicketCategoryDto[];
}
