import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserDto } from '../../../users/dto/user.dto';

export class RoleDto {
  id: number;

  name: string;

  @Exclude()
  @ApiHideProperty()
  users: UserDto[];
}
