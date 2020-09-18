import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async findOne(id: string): Promise<Role> {
    return this.rolesRepository.findOneOrFail(id);
  }

  async create(role: CreateRoleDto): Promise<Role> {    
    return this.rolesRepository.save(role);
  }

  async update(id: string, role: CreateRoleDto): Promise<Role> {    
    return this.rolesRepository.save({ ...role, id: Number(id) });
  }

  async remove(id: string): Promise<void> {
    await this.rolesRepository.findOneOrFail(id);
    await this.rolesRepository.delete(id);
  }
}