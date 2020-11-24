import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../../domain/users/roles/role.entity';
import { RolesService } from '../../domain/users/roles/roles.service';
import { Repository } from 'typeorm';
import { User } from '../../domain/users/user.entity';
import { UsersService } from '../../domain/users/users.service';
import { Logger, LoggerService } from '@nestjs/common';
import { CommandLineArgsOptions, Seeder } from './seeder';
import { MockRepository } from '../../repository.mock';
import { Subscription } from '../../domain/subscriptions/subscription.entity';
import { Assignment } from '../../domain/assignments/assignment.entity';
import { SubscriptionsService } from '../../domain/subscriptions/subscriptions.service';
import { AssignmentsService } from '../../domain/assignments/assignments.service';

describe('Seeder', () => {
  let seeder: Seeder;
  let logger: LoggerService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
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
        SubscriptionsService,
        {
          provide: getRepositoryToken(Subscription),
          useClass: MockRepository,
        },
        AssignmentsService,
        {
          provide: getRepositoryToken(Assignment),
          useClass: MockRepository,
        },
        Seeder,
        Logger
      ],
    }).compile();

    seeder = moduleRef.get<Seeder>(Seeder);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = moduleRef.get<Repository<Role>>(getRepositoryToken(Role));
    logger = moduleRef.get<Logger>(Logger);
  });

  describe('run', () => {
    it('should create items if they don\'t exist', async () => {
      jest.spyOn(logger, 'debug').mockImplementation(() => null);

      jest.spyOn(roleRepository, 'findOne').mockImplementationOnce(async () => null);
      jest.spyOn(roleRepository, 'save').mockImplementation(async () => ([{id: 1}] as any));

      jest.spyOn(userRepository, 'findOne').mockImplementationOnce(async () => null);
      jest.spyOn(userRepository, 'save').mockImplementation(async () => ([{id: 1}] as any));

      await seeder.run({ prod: true } as any as CommandLineArgsOptions);

      expect(roleRepository.save).toBeCalled();
      expect(logger.debug).toBeCalledWith('Admin role created.');
      expect(logger.debug).toBeCalledWith('Admin user created.');
    });

    it('should skip items if they exist', async () => {
      jest.spyOn(logger, 'debug').mockImplementation(() => null);
      jest.spyOn(roleRepository, 'save');
      jest.spyOn(roleRepository, 'findOne').mockImplementation(async () => ({id: 1} as Role));
      jest.spyOn(userRepository, 'findOne').mockImplementation(async () => ({id: 1} as User));

      await seeder.run({ prod: true } as any as CommandLineArgsOptions);

      expect(roleRepository.save).not.toBeCalled();
      expect(logger.debug).toBeCalledWith('Admin role already exists, skipping.');
      expect(logger.debug).toBeCalledWith('Admin user already exists, skipping.');
    });
  });
});
