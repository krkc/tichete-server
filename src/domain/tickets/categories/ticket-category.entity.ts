import { Base } from '../../../base/base.abstract-entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Subscription } from '../../subscriptions/subscription.entity';
import { Tag } from '../../tags/tag.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class TicketCategory extends Base {
  @Column()
  name!: string;

  @OneToMany(() => Tag, tag => tag.category, {
    cascade: true
  })
  tags?: Promise<Tag[]>;

  @OneToMany(() => Subscription, subscription => subscription.category, {
    cascade: true
  })
  subscriptions?: Promise<Subscription[]>;
}
