import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { TicketStatusesService } from './statuses/ticket-statuses.service';
import { TicketStatusDto } from './statuses/dto/ticket-status.dto';
import { TicketDto } from './dto/ticket.dto';
import { classToPlain, plainToClass } from 'class-transformer';
import { TicketCategoryDto } from './categories/dto/ticket-category.dto';
import { TicketCategoriesService } from './categories/ticket-categories.service';

@Injectable()
export class TicketsService extends TypeOrmCrudService<Ticket> {
  constructor(
    @InjectRepository(Ticket) public repo: Repository<Ticket>,
    private usersService: UsersService,
    private ticketStatusesService: TicketStatusesService,
    private ticketCategoriesService: TicketCategoriesService
  ) {
    super(repo);
  }

  async setTicketCreator(id: number, user: UserDto): Promise<TicketDto> {
    const ticket = this.convertToDto(await this.repo.findOne({ id }, { relations: ['creator'] }));
    if (!ticket) this.throwNotFoundException('Ticket');

    ticket.creator = this.usersService.convertToDto(await this.usersService.findOne(user));
    if (!ticket.creator) this.throwNotFoundException('User');

    return await this.repo.save(ticket);
  }

  async setTicketStatus(id: number, status: TicketStatusDto): Promise<TicketDto> {
    const ticket = this.convertToDto(await this.repo.findOne({ id }, { relations: ['status'] }));
    if (!ticket) this.throwNotFoundException('Ticket');

    ticket.status = this.ticketStatusesService.convertToDto(await this.ticketStatusesService.findOne(status));
    if (!ticket.status) this.throwNotFoundException('Status');

    return await this.repo.save(ticket);
  }

  async addTicketTag(id: number, category: TicketCategoryDto) {
    const ticket = this.convertToDto(await this.repo.findOne({ id }, { relations: ['taggedCategories'] }));
    if (!ticket) this.throwNotFoundException('Ticket');

    category = this.ticketCategoriesService.convertToDto(await this.ticketCategoriesService.findOne(category));
    if (!category) this.throwNotFoundException('Category');

    ticket.taggedCategories.push(category);

    return await this.repo.save(ticket);
  }

  convertToDto(ticket: any): TicketDto {
    return plainToClass(TicketDto, classToPlain(ticket));
  }
}
