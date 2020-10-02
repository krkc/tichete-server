import { Base } from '../../base/base.abstract-entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Subscription } from '../../subscriptions/subscription.entity';
import { Tag } from '../../tags/tag.entity';

@Entity()
export class TicketCategory extends Base {
  @Column()
  name: string;

  @OneToMany(() => Tag, tag => tag.category)
  taggedTickets: Tag[];

  @OneToMany(() => Subscription, subscription => subscription.category, {
    cascade: true
  })
  subscribedUsers: Subscription[];
}
