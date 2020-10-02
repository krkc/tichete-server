import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { BaseController } from '../../base/base.abstract-controller';
import { RoleDto } from './dto/role.dto';
import { Role } from './role.entity';
import { RolesService } from './roles.service';

@Crud({
  model: {
    type: RoleDto,
  },
  routes: BaseController.routesOptions
})
@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RolesController implements BaseController<Role> {
  constructor(public readonly service: RolesService) {}
}
