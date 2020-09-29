import { ApiHideProperty } from '@nestjs/swagger';
import { UserDto } from '../../../users/dto/user.dto';

export class RoleDto {
  id: number;
  name: string;
  @ApiHideProperty()
  users: UserDto[];
}
