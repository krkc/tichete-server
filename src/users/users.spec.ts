import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../roles/role.entity';
import { RolesService } from '../roles/roles.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MockRepository } from '../repository.mock';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let rolesRepository: Repository<Role>;
  let usersRepository: Repository<User>;

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
      ],
    }).compile();

    usersRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    rolesRepository = moduleRef.get<Repository<Role>>(getRepositoryToken(Role));
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should return a user', async () => {
      const email = "admin@site.com";
      const password = "password";
      const userDto = {email, password} as CreateUserDto;

      jest.spyOn(usersRepository, 'create').mockImplementation((createUserDto) => {
        return {email: createUserDto.email, password: createUserDto.password} as User;
      });

      jest.spyOn(usersRepository, 'save').mockImplementation(async (createUserDto) => {
        return {id: 1, email: createUserDto.email, password: createUserDto.password} as User;
      });

      const user = {id: 1, email, password} as User;
      expect(await usersService.create(userDto)).toEqual(usersService.convertToDto(user));
    });
  });

  describe('getAssignedRole', () => {
    it('if user not found, should throw error', async () => {
      jest.spyOn(usersRepository, 'findOne').mockImplementation(async () => null);
      expect(usersService.getAssignedRole(1)).rejects.toThrowError(NotFoundException);
    });

    it('if user not assigned a role, should return null', async () => {
      const userId = 1;
      const user = new User({ id: userId });
      jest.spyOn(usersRepository, 'findOne').mockImplementation(async () => user);

      expect(await usersService.getAssignedRole(userId)).toBeNull();

    });

    it('should return the user\'s assigned role', async () => {
      const userId = 1;
      const roleId = 1;
      const role = new Role({ id: roleId });
      const user = new User({ id: userId, role });
      jest.spyOn(usersRepository, 'findOne').mockImplementation(async () => user);

      expect(await usersService.getAssignedRole(userId)).toEqual(role);

    });
  });

  describe('assignRole', () => {
    it('should return a user with the role set', async () => {
      const userId = 1;
      const roleId = 1;
      const user = new User({ id: userId });
      const role = new Role({ id: roleId });
      jest.spyOn(rolesRepository, 'findOne').mockImplementation(async () => role);
      jest.spyOn(usersRepository, 'findOne').mockImplementation(async () => user);
      const usersRepositorySpy = jest.spyOn(usersRepository, 'save').mockImplementation(async () => ({ ...user, role } as User));

      await usersService.assignRole(userId, roleId);

      expect(usersRepositorySpy).toHaveReturned();
    });
  });
});
