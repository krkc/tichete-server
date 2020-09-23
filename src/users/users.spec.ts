import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../roles/role.entity';
import { RolesService } from '../roles/roles.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
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
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [ new User() ];
      jest.spyOn(usersService, 'findAll').mockImplementation(async () => users);

      expect(await usersController.getAll()).toBe(users);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = new User();
      user.id = 1;
      jest.spyOn(usersService, 'findOne').mockImplementation(async (id: string) => [user].find(u => u.id === +id));

      expect(await usersController.getOne('1')).toBe(user);
    });
  });

  describe('create', () => {
    it('should return a user', async () => {
      const email = "admin@site.com";
      const password = "password";
      const userDto = {email, password} as Partial<CreateUserDto>;

      jest.spyOn(usersService, 'create').mockImplementation(async (createUserDto: CreateUserDto) => {
        return {id: 1, email: createUserDto.email, password: createUserDto.password} as Partial<User> as User;
      });

      const user = {id: 1, email, password} as Partial<User>;
      expect(await usersController.create(userDto as CreateUserDto)).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = "1";
      const updateUserDto = {email: 'admin@site.com', password: 'password'} as Partial<CreateUserDto>;
      const user = { ...updateUserDto, id: +id } as Partial<User>;
      const users = [user as Partial<User>];

      jest.spyOn(usersService, 'update').mockImplementation(async (_id: string, createUserDto: CreateUserDto) => {
        const currentUser = users.find(u => u.id === +_id);
        if (!currentUser) throw new Error();

        return {...createUserDto, id: currentUser.id} as User;
      });

      user.password = updateUserDto.password = 'newPassword';
      expect(await usersController.update(id, updateUserDto as UserDto)).toEqual(user);
      users.pop();
      await expect(usersController.update(id, updateUserDto as UserDto)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const user = {id: 1} as Partial<User>;
      let users = [user];
      jest.spyOn(usersService, 'remove').mockImplementation(async (id: string) => {
        if (!users.includes(user)) throw new Error();

        users = users.filter(u => u.id !== +id);
        return null;
      });

      expect(await usersController.remove(user.id.toString())).toBeNull();
      await expect(usersController.remove(user.id.toString())).rejects.toThrow();
    });
  });
});
