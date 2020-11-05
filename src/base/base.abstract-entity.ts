import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export abstract class Base<T extends Base = any> {
  constructor(partial: Partial<T> = {}) {
    Object.assign(this, partial);
  }

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({name: 'updated_at'})
  updatedAt!: Date;
}
