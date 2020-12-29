import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../../base/base.abstract-service';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService  extends BaseService<Role> {
  constructor(
    @InjectRepository(Role)
    public repo: Repository<Role>,
  ) {
    super(repo);
  }
}
