import { Ticket } from '../../../tickets/ticket.entity';
import { User } from '../../../users/user.entity';

export class TicketCategoryDto {
  id: number;
  name: string;
  taggedTickets: Ticket[];
  subscribedUsers: User[];
}
