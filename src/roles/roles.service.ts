import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<RoleDto[]> {
    const roles = await this.rolesRepository.find();
    return roles.map(this.convertToDto);
  }

  async findOne(id: string): Promise<RoleDto> {
    const role = await this.rolesRepository.findOne(id);
    if (!role) throw new NotFoundException();

    return role;
  }

  async create(role: CreateRoleDto): Promise<RoleDto> {
    return this.rolesRepository.save(role);
  }

  async update(id: string, roleDto: RoleDto): Promise<RoleDto> {
    const role = await this.rolesRepository.findOne(id);
    if (!role) throw new NotFoundException();

    return this.rolesRepository.save({ ...roleDto, id: Number(id) });
  }

  async remove(id: string): Promise<void> {
    const role = await this.rolesRepository.findOne(id);
    if (!role) throw new NotFoundException();

    await this.rolesRepository.delete(id);
  }

  convertToDto(role: any): RoleDto {
    return plainToClass(RoleDto, classToPlain(role));
  }
}
