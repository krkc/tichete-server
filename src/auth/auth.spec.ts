import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import * as argon2 from 'argon2';
import { LoggerService } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDto } from '../users/dto/user.dto';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/role.entity';

describe('The Authentication Service', () => {
  let authService: AuthService;
  let usersService: UsersService;
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
          useClass: Repository,
        },
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useFactory: () => ({ sign: () => '' })
        }
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);

    jest.spyOn(usersService, 'findOneByEmail').mockImplementation(async (_email) => {
      if (users.length < 1) throw new Error();

      const _user = users.find((u) => u.email === _email);
      _user.password = await argon2.hash(_user.password);
      return _user;
    });

    logger = jest.fn<LoggerService,[]>(() => ({
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn()
    }))();
    moduleRef.useLogger(logger);
  });

  describe('when validating an authenticating user', () => {
    it('should return the user without the password field', async () => {
      users = [{email, password: pass} as User];

      const validatedUser = await authService.validateAndGetUser(email, pass);
      expect(validatedUser).toEqual(usersService.convertToDto(users[0]));
    });

    it('should log error and return null if user not found', async () => {
      users = [];

      const user = await authService.validateAndGetUser(email, pass);
      expect(logger.error).toBeCalledTimes(1);
      expect(user).toBeNull();
    });
  });

  describe('when logging an authenticated user in', () => {
    it('should generate an access token', async () => {
      const user = { id: 1 } as UserDto;
      const token = await authService.getAuthToken(user);
      expect(token).toEqual({access_token: ''});
    });
  });
});

describe('The AppController\'s Auth Routes', () => {
  let authController: AuthController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useFactory: () => ({ sign: () => '' })
        }
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('when logging in an authenticated user', () => {
    it('should contain an access token in the response data', async () => {
      const token = await authController.login(new UserDto());
      expect(token).toEqual({access_token: ''});
    });
  });

  describe('when registering a new user', () => {
    it('upon receiving valid input, should return a new user', async () => {
      const createUserDto = new CreateUserDto();
      jest.spyOn(usersService, 'create').mockImplementation(async (_createUserDto: CreateUserDto) => _createUserDto as UserDto);
      const user = await authController.register(createUserDto);
      expect(user).toEqual(createUserDto as UserDto);
    });
  });
});
