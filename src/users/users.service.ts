import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { Role } from './roles/role.entity';
import { RolesService } from './roles/roles.service';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { RoleDto } from './roles/dto/role.dto';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    public repo: Repository<User>,
    private rolesService: RolesService
  ) {
    super(repo)
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const newUser = await this.repo.save(this.repo.create(createUserDto));

    return this.convertToDto(newUser);
  }

  async getAssignedRole(id: number): Promise<RoleDto> {
    const user = await this.repo.findOne(id, { relations: ['role'] });
    if (!user) this.throwNotFoundException('User');

    if (!user.role) return null;

    return this.rolesService.convertToDto(user.role);
  }

  async assignRole(userId: number, roleId?: number): Promise<void> {
    const role = await this.rolesService.findOne(roleId?.toString());
    const user = await this.repo.findOne(userId);
    user.role = role as Role;
    await this.repo.save(user);
  }

  async isPasswordCorrect(userId: number, plainPassword: string): Promise<boolean> {
    const user = await this.repo.findOne(userId);
    if (!user) throw new NotFoundException();

    return argon2.verify(user.password, plainPassword);
  }

  convertToDto(user: any): UserDto {
    return plainToClass(UserDto, classToPlain(user));
  }
}
