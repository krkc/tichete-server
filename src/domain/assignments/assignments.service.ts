import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../base/base.abstract-service';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { UsersService } from '../users/users.service';
import { TicketsService } from '../tickets/tickets.service';

@Injectable()
export class AssignmentsService extends BaseService<Assignment> {
  constructor(
    @InjectRepository(Assignment) public repo: Repository<Assignment>,
    protected readonly usersService: UsersService,
    protected readonly ticketsService: TicketsService,
  ) {
    super(repo);
  }
}
