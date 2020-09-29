import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: UserDto,
  },
  dto: {
    create: CreateUserDto
  }
})
@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(
    public readonly service: UsersService
  ) {}

  @ApiOperation({ summary: 'Retrieve the role assigned to a user' })
  @Get('/:id/roles')
  async getRole(@Param('id') id: number) {
    return this.service.getAssignedRole(id);
  }

  @ApiOperation({ summary: 'Assign a user to a role' })
  @Post('/:id/roles/:roleId')
  async assignRole(@Param('id') id: number, @Param('roleId') roleId: number) {
    return this.service.assignRole(id, roleId);
  }
}
