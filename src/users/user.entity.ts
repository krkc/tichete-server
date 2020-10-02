import * as argon2 from 'argon2';
import { Entity, Column, ManyToOne, BeforeInsert, Unique, OneToMany } from 'typeorm';
import { Base } from '../base/base.abstract-entity';
import { Role } from '../users/roles/role.entity';
import { Ticket } from '../tickets/ticket.entity';
import { Assignment } from '../assignments/assignment.entity';
import { Subscription } from '../subscriptions/subscription.entity';

@Entity()
@Unique(['email'])
export class User extends Base {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  email: string;

  @Column({select: false})
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @Column({ nullable: true })
  roleId: number;

  @ManyToOne(() => Role, role => role.users)
  role: Role;

  @OneToMany(() => Ticket, ticket => ticket.creator)
  submittedTickets: Ticket[];

  @OneToMany(() => Assignment, assignment => assignment.user, {
    cascade: true
  })
  assignedTickets: Assignment[];

  @OneToMany(() => Subscription, subscription => subscription.user, {
    cascade: true
  })
  subscriptions: Subscription[];
}
