import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../domain/users/user.entity';
import { UsersService } from '../domain/users/users.service';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { LoggerService } from '@nestjs/common';
import { RolesService } from '../domain/users/roles/roles.service';
import { Role } from '../domain/users/roles/role.entity';
import { MockRepository } from '../repository.mock';
import { Assignment } from '../domain/assignments/assignment.entity';
import { AssignmentsService } from '../domain/assignments/assignments.service';
import { SubscriptionsService } from '../domain/subscriptions/subscriptions.service';
import { Subscription } from '../domain/subscriptions/subscription.entity';

describe('The Authentication Service', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let logger: LoggerService;

  const email = 'admin@site.com';
  const pass = 'password';

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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
        {
          provide: JwtService,
          useFactory: () => ({ sign: () => '' })
        }
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));

    logger = jest.fn<LoggerService,[]>(() => ({
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn()
    }))();
    moduleRef.useLogger(logger);
  });

  describe('when validating an authenticating user', () => {

    it('if user not found, should return null', async () => {
      jest.spyOn(userRepository, 'findOne').mockImplementation(async () => null);

      const user = await authService.validateAndGetUser(email, pass);
      expect(user).toBeNull();
    });
  });

  describe('when logging an authenticated user in', () => {
    it('should generate an access token', async () => {
      const user = { id: 1 } as User;
      const token = await authService.setAuthToken(user);
      expect(token).toEqual({...user, accessToken: ''});
    });
  });

});
