import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '../base/base.abstract-entity';
import { User } from '../users/user.entity';
import { Ticket } from '../tickets/ticket.entity';

@Entity()
export class Assignment extends Base {
  @Column()
  public userId!: number;

  @Column()
  public ticketId!: number;

  @ManyToOne(() => User, user => user.assignedTickets)
  public user!: User;

  @ManyToOne(() => Ticket, ticket => ticket.assignees)
  public ticket!: Ticket;
}
