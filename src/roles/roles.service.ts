import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';
import { Role } from './role.entity';

@Injectable()
export class RolesService extends TypeOrmCrudService<Role> {
  constructor(
    @InjectRepository(Role)
    public repo: Repository<Role>,
  ) {
    super(repo);
  }

  async create(createUserDto: CreateRoleDto): Promise<RoleDto> {
    const newUser = await this.repo.save(this.repo.create(createUserDto));

    return this.convertToDto(newUser);
  }

  convertToDto(role: any): RoleDto {
    return plainToClass(RoleDto, classToPlain(role));
  }
}
