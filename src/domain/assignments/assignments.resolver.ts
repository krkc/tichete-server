import { Injectable } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './assignment.entity';
import { createBaseResolver } from '../../base/base.abstract-resolver';
import { NewAssignmentInput } from './dto/new-assignment.input';
import { UpdateAssignmentInput } from './dto/update-assignment.input';

@Injectable()
@Resolver()
export class AssignmentsResolver extends createBaseResolver(`${Assignment.name}s`, Assignment, NewAssignmentInput, UpdateAssignmentInput) {
  constructor(
    protected readonly service: AssignmentsService
  ) {
    super(service);
  }
}
