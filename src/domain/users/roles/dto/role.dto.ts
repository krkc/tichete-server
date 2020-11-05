import { ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { UserDto } from '../../dto/user.dto';

@ObjectType()
export class RoleDto {
  id: number;
  name: string;

  // @Exclude()
  users!: UserDto[];
}
