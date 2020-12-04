import { Injectable } from '@nestjs/common';
import { AssignmentsService } from '../domain/assignments/assignments.service';
import { Assignment } from '../domain/assignments/assignment.entity';
import { BaseLoader } from './base.loader';

@Injectable()
export class AssignmentLoader extends BaseLoader<Assignment> {
  constructor(assignmentsService: AssignmentsService) {
    super(assignmentsService);
  }
}
