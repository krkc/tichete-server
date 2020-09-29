import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockRepository } from '../repository.mock';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Role } from '../roles/role.entity';
import { RolesService } from '../roles/roles.service';

describe('TicketsService', () => {
  let ticketsService: TicketsService;
  let ticketsRepository: Repository<Ticket>;

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
      ],
    }).compile();

    ticketsRepository = moduleRef.get<Repository<Ticket>>(getRepositoryToken(Ticket));
    ticketsService = moduleRef.get<TicketsService>(TicketsService);
  });

  describe('getTicketCreator', () => {
    it('when ticket not found, should throw error', async () => {
      jest.spyOn(ticketsRepository, 'findOne').mockImplementation(async () => null);
      expect(ticketsService.getTicketCreator(1)).rejects.toThrowError(NotFoundException);
    });

    it('should return the ticket\'s creator', async () => {
      const ticketId = 1;
      const userId = 1;
      const user = new User({ id: userId });
      const ticket = new Ticket({ id: ticketId, creator: user });
      jest.spyOn(ticketsRepository, 'findOne').mockImplementation(async () => ticket);

      expect(await ticketsService.getTicketCreator(ticketId)).toEqual(user);
    });
  });
});
