import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../domain/users/user.entity';
import { UsersService } from '../domain/users/users.service';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import * as argon2 from 'argon2';
import { LoggerService } from '@nestjs/common';
import { UserDto } from '../domain/users/dto/user.dto';
import { RolesService } from '../domain/users/roles/roles.service';
import { Role } from '../domain/users/roles/role.entity';
import { MockRepository } from '../repository.mock';

describe('The Authentication Service', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let logger: LoggerService;

  const email = 'admin@site.com';
  const pass = 'password';
  let users: UserDto[];

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
        {
          provide: JwtService,
          useFactory: () => ({ sign: () => '' })
        }
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));

    logger = jest.fn<LoggerService,[]>(() => ({
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn()
    }))();
    moduleRef.useLogger(logger);
  });

  describe('when validating an authenticating user', () => {
    it('if user found and passwords match, should return the user without the password field', async () => {
      users = [{email, password: await argon2.hash(pass)} as UserDto];
      jest.spyOn(userRepository, 'findOne').mockImplementation(async () => ({ ...users[0], id: 1 } as any as User));

      const validatedUser = await authService.validateAndGetUser(email, pass);
      expect(validatedUser).toEqual(usersService.convertToDto({ ...users[0], id: 1}, UserDto));
    });

    it('if user not found, should return null', async () => {
      jest.spyOn(userRepository, 'findOne').mockImplementation(async () => null);

      const user = await authService.validateAndGetUser(email, pass);
      expect(user).toBeNull();
    });
  });

  describe('when logging an authenticated user in', () => {
    it('should generate an access token', async () => {
      const user = { id: 1 } as UserDto;
      const token = await authService.setAuthToken(user);
      expect(token).toEqual({accessToken: ''});
    });
  });
});
