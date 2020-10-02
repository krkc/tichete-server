import { Base } from '../../base/base.abstract-entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Ticket } from '../ticket.entity';

@Entity()
export class TicketStatus extends Base {
  @Column()
  name: string;

  @OneToMany(() => Ticket, ticket => ticket.status)
  tickets: Ticket[];
}
