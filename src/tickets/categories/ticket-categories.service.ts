import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { plainToClass, classToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { TicketCategoryDto } from './dto/ticket-category.dto';
import { TicketCategory } from './ticket-category.entity';

@Injectable()
export class TicketCategoriesService extends TypeOrmCrudService<TicketCategory> {
  constructor(
    @InjectRepository(TicketCategory) public repo: Repository<TicketCategory>,
  ) {
    super(repo);
  }

  convertToDto(ticketStatus: any): TicketCategoryDto {
    return plainToClass(TicketCategoryDto, classToPlain(ticketStatus));
  }
}
