import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { plainToClass, classToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { TicketStatusDto } from './dto/ticket-status.dto';
import { TicketStatus } from './ticket-status.entity';

@Injectable()
export class TicketStatusesService extends TypeOrmCrudService<TicketStatus> {
  constructor(
    @InjectRepository(TicketStatus) public repo: Repository<TicketStatus>,
  ) {
    super(repo);
  }

  convertToDto(ticketStatus: any): TicketStatusDto {
    return plainToClass(TicketStatusDto, classToPlain(ticketStatus));
  }
}
