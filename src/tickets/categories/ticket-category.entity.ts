import { Base } from '../../base/base.abstract-entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Ticket } from '../ticket.entity';
import { User } from '../../users/user.entity';

@Entity()
export class TicketCategory extends Base {
  @Column()
  name: string;

  @ManyToMany(() => Ticket, ticket => ticket.taggedCategories)
  taggedTickets: Ticket[];

  @ManyToMany(() => User, user => user.subscriptions)
  subscribedUsers: User[];
}
