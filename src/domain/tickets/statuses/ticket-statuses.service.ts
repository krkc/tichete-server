import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../../base/base.abstract-service';
import { Repository } from 'typeorm';
import { TicketStatusDto } from './dto/ticket-status.dto';
import { TicketStatus } from './ticket-status.entity';
import { NewTicketStatusInput } from './dto/new-ticket-status.input';

@Injectable()
export class TicketStatusesService extends BaseService<TicketStatus> {
  constructor(
    @InjectRepository(TicketStatus) public repo: Repository<TicketStatus>,
  ) {
    super(repo);
  }

  // async create(data: NewTicketStatusInput): Promise<TicketStatus> {
  //   const newStatus = this.repo.create(data);
  //   return this.repo.save(newStatus);
  // }
}
