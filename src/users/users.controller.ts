import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { BaseController } from '../base/base.abstract-controller';
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
  },
  routes: BaseController.routesOptions,
})
@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController implements BaseController<User> {
  constructor(
    public readonly service: UsersService
  ) {}
}
