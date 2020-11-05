import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '../../base/base.abstract-entity';
import { User } from '../users/user.entity';
import { TicketCategory } from '../tickets/categories/ticket-category.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Subscription extends Base {
  @Column()
  public userId!: number;

  @Column()
  public categoryId!: number;

  @ManyToOne(() => User, user => user.subscriptions)
  public user!: User;

  @ManyToOne(() => TicketCategory, category => category.subscribedUsers)
  public category!: TicketCategory;
}
