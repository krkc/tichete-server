import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { AssignmentDto } from './dto/assignment.dto';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './assignment.entity';
import { BaseController } from '../base/base.abstract-controller';

@Crud({
  model: {
    type: AssignmentDto,
  },
  routes: BaseController.routesOptions
})
@ApiTags('Assignments')
@Controller('assignments')
export class AssignmentsController implements BaseController<Assignment> {
  constructor(
    public readonly service: AssignmentsService
  ) {}
}
