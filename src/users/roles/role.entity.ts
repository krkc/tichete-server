import { Base } from '../../base.abstract-entity';
import { User } from '../../users/user.entity';
import { Entity, Column, OneToMany, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class Role extends Base {
  @Column()
  name: string;

  @OneToMany(() => User, user => user.role)
  users: User[];
}
