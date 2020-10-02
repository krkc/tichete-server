import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.abstract-service';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';

@Injectable()
export class AssignmentsService extends BaseService<Assignment> {
  constructor(
    @InjectRepository(Assignment) public repo: Repository<Assignment>
  ) {
    super(repo);
  }
}
