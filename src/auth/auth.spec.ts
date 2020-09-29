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
      users = [{email, password: await argon2.hash(pass)} as User];
      jest.spyOn(userRepository, 'findOne').mockImplementation(async () => ({ ...users[0], id: 1 } as User));

      const validatedUser = await authService.validateAndGetUser(email, pass);
      expect(validatedUser).toEqual(usersService.convertToDto({ ...users[0], id: 1}));
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

    authController = moduleRef.get<AuthController>(AuthController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('when logging in an authenticated user', () => {
    it('should contain an access token in the response data', async () => {
      const token = await authController.login({ user: new UserDto() });
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
