import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockRepository } from '../repository.mock';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Role } from '../users/roles/role.entity';
import { RolesService } from '../users/roles/roles.service';
import { UserDto } from '../users/dto/user.dto';
import { TicketStatusesService } from './statuses/ticket-statuses.service';
import { TicketStatus } from './statuses/ticket-status.entity';
import { TicketStatusDto } from './statuses/dto/ticket-status.dto';

describe('TicketsService', () => {
  let ticketsService: TicketsService;
  let ticketsRepository: Repository<Ticket>;
  let usersRepository: Repository<User>;
  let ticketStatusesRepository: Repository<TicketStatus>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useClass: MockRepository,
        },
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: MockRepository,
        },
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useClass: MockRepository,
        },
        TicketStatusesService,
        {
          provide: getRepositoryToken(TicketStatus),
          useClass: MockRepository,
        },
      ],
    }).compile();

    ticketsRepository = moduleRef.get<Repository<Ticket>>(getRepositoryToken(Ticket));
    ticketsService = moduleRef.get<TicketsService>(TicketsService);
    usersRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    ticketStatusesRepository = moduleRef.get<Repository<TicketStatus>>(getRepositoryToken(TicketStatus));
  });

  describe('setTicketCreator', () => {
    it('when ticket not found, should throw error', async () => {
      jest.spyOn(ticketsRepository, 'findOne').mockImplementation(async () => null);
      expect(ticketsService.setTicketCreator(1, { id: 1 } as UserDto)).rejects.toThrowError(NotFoundException);
    });

    it('should return the ticket with updated creator', async () => {
      const ticketId = 1;
      const userId = 1;
      const user = new User({ id: userId });
      const ticket = new Ticket({ id: ticketId });
      jest.spyOn(usersRepository, 'findOne').mockImplementation(async () => user);
      jest.spyOn(ticketsRepository, 'findOne').mockImplementation(async () => ticket);
      ticket.creator = user;
      jest.spyOn(ticketsRepository, 'save').mockImplementation(async () => ticket);

      expect(await ticketsService.setTicketCreator(ticketId, {...user} as UserDto)).toEqual(ticket);
    });
  });

  describe('setTicketStatus', () => {
    it('when ticket not found, should throw error', async () => {
      jest.spyOn(ticketsRepository, 'findOne').mockImplementation(async () => null);
      expect(ticketsService.setTicketStatus(1, { id: 1, name: 'test status' } as TicketStatusDto)).rejects.toThrowError(NotFoundException);
    });

    it('should return the ticket with updated status', async () => {
      const ticketId = 1;
      const ticketStatusId = 1;
      const ticketStatus = new TicketStatus({ id: ticketStatusId, name: 'test status' });
      const ticket = new Ticket({ id: ticketId });
      jest.spyOn(ticketStatusesRepository, 'findOne').mockImplementation(async () => ticketStatus);
      jest.spyOn(ticketsRepository, 'findOne').mockImplementation(async () => ticket);
      ticket.status = ticketStatus;
      jest.spyOn(ticketsRepository, 'save').mockImplementation(async () => ticket);

      expect(await ticketsService.setTicketStatus(ticketId, {...ticketStatus} as TicketStatusDto)).toEqual(ticket);
    });
  });
});
