import { Base } from '../../../base/base.abstract-entity';
import { User } from '../user.entity';
import { Entity, Column, OneToMany, Unique } from 'typeorm';
import { HideField, ObjectType } from '@nestjs/graphql';
import { Permission } from './permissions/permission.entity';

@ObjectType()
@Entity()
@Unique(['name'])
export class Role extends Base {
  @Column()
  name!: string;

  @Column({ default: false })
  isSystemAdmin!: boolean;

  @OneToMany(() => User, user => user.role)
  users?: Promise<User[]>;

  @OneToMany(() => Permission, permission => permission.role)
  permissions?: Promise<Permission[]>;
}
