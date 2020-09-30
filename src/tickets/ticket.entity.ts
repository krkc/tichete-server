import { Base } from '../base.abstract-entity';
import { User } from '../users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, } from 'typeorm';
import { TicketStatus } from './statuses/ticket-status.entity';

@Entity()
export class Ticket extends Base {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  creatorId: number;

  @ManyToOne(() => User, user => user.submittedTickets)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @ManyToOne(() => TicketStatus, ticketStatus => ticketStatus.tickets)
  status: TicketStatus;
}
