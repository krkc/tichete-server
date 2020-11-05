import { Exclude } from 'class-transformer';
import { Ticket } from '../../ticket.entity';
import { User } from '../../../users/user.entity';

export class TicketCategoryDto {
  id: number;

  name: string;

  @Exclude()
  taggedTickets: Ticket[];

  @Exclude()
  subscribedUsers: User[];
}
