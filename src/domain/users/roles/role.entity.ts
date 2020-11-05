import { Base } from '../../../base/base.abstract-entity';
import { User } from '../user.entity';
import { Entity, Column, OneToMany, Unique } from 'typeorm';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
@Unique(['name'])
export class Role extends Base {
  @Column()
  name!: string;

  @OneToMany(() => User, user => user.role)
  users?: Promise<User[]>;
}
