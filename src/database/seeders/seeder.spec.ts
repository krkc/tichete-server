import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../../roles/role.entity';
import { RolesService } from '../../roles/roles.service';
import { Repository } from 'typeorm';
import { UserDto } from '../../users/dto/user.dto';
import { User } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import { Logger, LoggerService } from '@nestjs/common';
import { CommandLineArgsOptions, Seeder } from './seeder';
import { RoleDto } from '../../roles/dto/role.dto';
import { MockRepository } from '../../repository.mock';

describe('Seeder', () => {
  let seeder: Seeder;
  let rolesService: RolesService;
  let usersService: UsersService;
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
        Seeder,
        Logger
      ],
    }).compile();

    seeder = moduleRef.get<Seeder>(Seeder);
    rolesService = moduleRef.get<RolesService>(RolesService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = moduleRef.get<Repository<Role>>(getRepositoryToken(Role));
    usersService = moduleRef.get<UsersService>(UsersService);
    logger = moduleRef.get<Logger>(Logger);
  });

  describe('run', () => {
    it('should create items if they don\'t exist', async () => {
      jest.spyOn(logger, 'debug').mockImplementation(() => null);

      jest.spyOn(roleRepository, 'findOne').mockImplementationOnce(async () => null);
      jest.spyOn(rolesService, 'create').mockImplementation(async () => ({id: 1} as RoleDto));
      jest.spyOn(roleRepository, 'findOne').mockImplementationOnce(async () => ({id: 1} as Role));

      jest.spyOn(userRepository, 'findOne').mockImplementationOnce(async () => null);
      jest.spyOn(userRepository, 'save').mockImplementation(async () => null);
      jest.spyOn(usersService, 'create').mockImplementation(async () => ({id: 1} as UserDto));
      jest.spyOn(userRepository, 'findOne').mockImplementationOnce(async () => ({id: 1} as User));

      await seeder.run({ prod: true } as any as CommandLineArgsOptions);

      expect(rolesService.create).toBeCalled();
      expect(logger.debug).toBeCalledWith('Admin role created.');
      expect(usersService.create).toBeCalled();
      expect(logger.debug).toBeCalledWith('Admin user created.');
    });

    it('should skip items if they exist', async () => {
      jest.spyOn(logger, 'debug').mockImplementation(() => null);
      jest.spyOn(rolesService, 'create');
      jest.spyOn(usersService, 'create');
      jest.spyOn(roleRepository, 'findOne').mockImplementation(async () => ({id: 1} as Role));
      jest.spyOn(userRepository, 'findOne').mockImplementation(async () => ({id: 1} as User));

      await seeder.run({ prod: true } as any as CommandLineArgsOptions);

      expect(rolesService.create).not.toBeCalled();
      expect(logger.debug).toBeCalledWith('Admin role already exists, skipping.');
      expect(usersService.create).not.toBeCalled();
      expect(logger.debug).toBeCalledWith('Admin user already exists, skipping.');
    });
  });
});
