import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '../../base/base.abstract-entity';
import { User } from '../users/user.entity';
import { Ticket } from '../tickets/ticket.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Assignment extends Base {
  @Column()
  public userId!: number;

  @Column()
  public ticketId!: number;

  // TODO: Some sort of optional message from the assigner
  //       that the assignee will see when they view their assignment.
  //       Eventually may be an associated message chain related
  //       to the assignment instead.
  // example:
  // @Column()
  // public notes?: string;

  @ManyToOne(() => User, user => user.assignments)
  public user?: Promise<User>;

  @ManyToOne(() => Ticket, ticket => ticket.assignments)
  public ticket?: Promise<Ticket>;
}
