import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '../base/base.abstract-entity';
import { Ticket } from '../tickets/ticket.entity';
import { TicketCategory } from '../tickets/categories/ticket-category.entity';

@Entity()
export class Tag extends Base {
  @Column()
  public ticketId!: number;

  @Column()
  public categoryId!: number;

  @ManyToOne(() => Ticket, ticket => ticket.taggedCategories)
  public ticket!: Ticket;

  @ManyToOne(() => TicketCategory, category => category.taggedTickets)
  public category!: TicketCategory;
}
