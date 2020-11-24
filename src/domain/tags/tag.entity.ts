import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '../../base/base.abstract-entity';
import { Ticket } from '../tickets/ticket.entity';
import { TicketCategory } from '../tickets/categories/ticket-category.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Tag extends Base {
  @Column()
  public ticketId!: number;

  @Column()
  public categoryId!: number;

  @ManyToOne(() => Ticket, ticket => ticket.tags)
  public ticket?: Promise<Ticket>;

  @ManyToOne(() => TicketCategory, category => category.tags)
  public category?: Promise<TicketCategory>;
}
