import { Base } from '../base/base.abstract-entity';
import { User } from '../users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TicketStatus } from './statuses/ticket-status.entity';
import { Assignment } from '../assignments/assignment.entity';
import { Tag } from '../tags/tag.entity';

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

  @Column({ nullable: true })
  statusId: number;

  @ManyToOne(() => TicketStatus, ticketStatus => ticketStatus.tickets)
  status: TicketStatus;

  @OneToMany(() => Tag, tag => tag.ticket, {
    cascade: true
  })
  taggedCategories: Tag[];

  @OneToMany(() => Assignment, assignment => assignment.ticket, {
    cascade: true
  })
  assignees: Assignment[];
}
