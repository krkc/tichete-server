import { Base } from '../base.abstract-entity';
import { User } from '../users/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, } from 'typeorm';
import { TicketStatus } from './statuses/ticket-status.entity';
import { TicketCategory } from './categories/ticket-category.entity';

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

  @ManyToMany(() => TicketCategory)
  @JoinTable({ name: 'tags' })
  taggedCategories: TicketCategory[];
}
