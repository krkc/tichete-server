import { Base } from '../../../../base/base.abstract-entity';
import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { ObjectType } from '@nestjs/graphql';
import { Role } from '../role.entity';

@ObjectType()
@Unique(['resourceName', 'creatorOnly', 'roleId'])
@Entity()
export class Permission extends Base {
  @Column()
  resourceName!: string;

  @Column({ default: false })
  creatorOnly: boolean;

  @Column({ default: false })
  canCreate: boolean;
  @Column({ default: false })
  canRead: boolean;
  @Column({ default: false })
  canUpdate: boolean;
  @Column({ default: false })
  canDelete: boolean;

  @Column()
  public roleId!: number;

  @ManyToOne(() => Role, role => role.permissions)
  public role?: Promise<Role>;
}

// Normal non admin user:
// Me resolver
//  -returns 'me' user with relations:
//    - submitted tickets & status
// Submit ticket (would redirect back to dashboard)
//  - View all categories
// View details of their submitted tickets, but
// not assignments.

// Admin user:
// Me resolver
// - same as above, plus:
//    - my feed resolver (assigned & subscribed)
