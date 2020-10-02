import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Ticket } from '../../../tickets/ticket.entity';
import { User } from '../../../users/user.entity';

export class TicketCategoryDto {
  id: number;

  name: string;

  @Exclude()
  @ApiHideProperty()
  taggedTickets: Ticket[];

  @Exclude()
  @ApiHideProperty()
  subscribedUsers: User[];
}
