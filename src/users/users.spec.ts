import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../roles/role.entity';
import { RolesService } from '../roles/roles.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { ImATeapotException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
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

    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return an empty array', async () => {
      const users: User[] = [];
      jest.spyOn(userRepository, 'find').mockImplementation(async () => users);

      expect(await usersService.findAll()).toEqual(users as UserDto[]);
    });

    it('should return an array of users', async () => {
      const users = [ new User() ];
      jest.spyOn(userRepository, 'find').mockImplementation(async () => users);

      expect(await usersService.findAll()).toEqual(users as UserDto[]);
    });
  });

  describe('findOne', () => {
    it('when user doesn\'t exist, should throw a Not Found exception', async () => {
      jest.spyOn(userRepository, 'findOne').mockImplementation(async () => null);

      await expect(usersService.findOne('1')).rejects.toThrowError(NotFoundException);
    });

    it('when user exists, should return the user dto', async () => {
      const user = new User();
      user.id = 1;
      jest.spyOn(userRepository, 'findOne').mockImplementation(async (id) => [user].find(u => u.id === +id));

      expect(await usersService.findOne('1')).toEqual(usersService.convertToDto(user));
    });
  });

  describe('create', () => {
    it('should return a user', async () => {
      const email = "admin@site.com";
      const password = "password";
      const userDto = {email, password} as CreateUserDto;

      jest.spyOn(userRepository, 'create').mockImplementation((createUserDto) => {
        return {email: createUserDto.email, password: createUserDto.password} as User;
      });

      jest.spyOn(userRepository, 'save').mockImplementation(async (createUserDto) => {
        return {id: 1, email: createUserDto.email, password: createUserDto.password} as User;
      });

      const user = {id: 1, email, password} as User;
      expect(await usersService.create(userDto)).toEqual(usersService.convertToDto(user));
    });
  });

  describe('update', () => {
    it('should throw not found exception', async () => {
      jest.spyOn(userRepository, 'findOne').mockImplementation(async () => null);

      await expect(usersService.update('1', {} as UserDto)).rejects.toThrowError(NotFoundException);
    });

    it('when using separate ids, should throw teapot exception', async () => {
      const crazyId = '2';
      const updateUserDto = {id: 1, email: 'admin@site.com', password: 'password'} as UserDto;

      await expect(usersService.update(crazyId, updateUserDto)).rejects.toThrowError(ImATeapotException);
    });

    it('should return an updated user dto', async () => {
      const id = "1";
      const updateUserDto = {id: +id, email: 'admin@site.com', password: 'password'} as UserDto;
      const newPassword = 'newPassword';

      jest.spyOn(userRepository, 'findOne').mockImplementation(async () => updateUserDto as User);

      jest.spyOn(userRepository, 'save').mockImplementation(async (_updateUserDto) => {
        _updateUserDto.password = newPassword;
        return _updateUserDto as User;
      });

      const updatedUser = usersService.convertToDto({ ...updateUserDto, password: newPassword, id: +id });
      expect(await usersService.update(id, updateUserDto as UserDto)).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('should throw not found exception', async () => {
      jest.spyOn(userRepository, 'findOne').mockImplementation(async () => null);

      await expect(usersService.remove('1')).rejects.toThrowError(NotFoundException);
    });

    it('should delete a user', async () => {
      const user = {id: 1} as User;

      jest.spyOn(userRepository, 'findOne').mockImplementation(async () => user);

      jest.spyOn(userRepository, 'delete').mockImplementation(async () => null);

      expect(await usersService.remove(user.id.toString())).toBeNull();
    });
  });
});
