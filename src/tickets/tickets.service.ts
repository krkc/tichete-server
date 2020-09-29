import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class TicketsService extends TypeOrmCrudService<Ticket> {
  constructor(
    @InjectRepository(Ticket) public repo: Repository<Ticket>,
    private usersService: UsersService,
  ) {
    super(repo);
  }

  async getTicketCreator(id: number): Promise<UserDto> {
    const ticket = await this.repo.findOne({ id }, { relations: ['creator'] })
    if (!ticket) this.throwNotFoundException('Ticket');

    return this.usersService.convertToDto(ticket.creator);
  }
}
