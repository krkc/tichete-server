import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { ResourceNotFoundError } from '../resource-not-found.error';
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
    if (!user) throw new ResourceNotFoundError();

    return this.convertToDto(user);
  }

  async findOneByEmail(email: string): Promise<UserDto> {
    const user = await this.usersRepository.findOne({ where: {email}});
    if (!user) throw new ResourceNotFoundError();

    return this.convertToDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.usersRepository.save(this.usersRepository.create(createUserDto));
    return this.convertToDto(user);
  }

  async update(id: string, updateUserDto: UserDto): Promise<UserDto> {
    const user = await this.usersRepository.save({ ...updateUserDto, id: Number(id) });
    return this.convertToDto(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.findOne(id);
    if (!user) throw new ResourceNotFoundError();

    await this.usersRepository.delete(id);
  }

  async assignRole(userId: number, roleId?: number): Promise<void> {
    const role = await this.rolesService.findOne(roleId.toString());
    const user = await this.usersRepository.findOne(userId);
    user.role = role as Role;
    this.usersRepository.save(user);
  }

  convertToDto(user: any): UserDto {
    return plainToClass(UserDto, classToPlain(user));
  }
}
