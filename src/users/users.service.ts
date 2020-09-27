import { ImATeapotException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private rolesService: RolesService
  ) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.usersRepository.find();
    return users.map(this.convertToDto);
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.usersRepository.findOne(id);
    if (!user) throw new NotFoundException();

    return this.convertToDto(user);
  }

  async findOneByEmail(email: string): Promise<UserDto> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) throw new NotFoundException();

    return this.convertToDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.usersRepository.save(this.usersRepository.create(createUserDto));
    return this.convertToDto(user);
  }

  async update(id: string, updateUserDto: UserDto): Promise<UserDto> {
    if (updateUserDto.id && +id !== updateUserDto.id) throw new ImATeapotException('Why are you using two separate ids? Trying to brew coffee in a teapot again?');

    if (!await this.usersRepository.findOne(id)) throw new NotFoundException();

    const user = await this.usersRepository.save({ ...updateUserDto, id: Number(id) });
    return this.convertToDto(user);
  }

  async remove(id: string): Promise<void> {
    if (!await this.usersRepository.findOne(id)) throw new NotFoundException();

    await this.usersRepository.delete(id);

    return null;
  }

  async assignRole(userId: number, roleId?: number): Promise<void> {
    const role = await this.rolesService.findOne(roleId.toString());
    const user = await this.usersRepository.findOne(userId);
    user.role = role as Role;
    this.usersRepository.save(user);
  }

  async isPasswordCorrect(userId: number, plainPassword: string): Promise<boolean> {
    const user = await this.usersRepository.findOne(userId);
    if (!user) throw new NotFoundException();

    return argon2.verify(user.password, plainPassword);
  }

  convertToDto(user: any): UserDto {
    return plainToClass(UserDto, classToPlain(user));
  }
}
