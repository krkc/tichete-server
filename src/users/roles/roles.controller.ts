import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { RoleDto } from './dto/role.dto';
import { Role } from './role.entity';
import { RolesService } from './roles.service';

@Crud({
  model: {
    type: RoleDto,
  },
})
@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RolesController implements CrudController<Role> {
  constructor(public readonly service: RolesService) {}
}
