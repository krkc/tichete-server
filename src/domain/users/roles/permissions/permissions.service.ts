import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../../base/base.abstract-service';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionsService extends BaseService<Permission> {
  constructor(
    @InjectRepository(Permission)
    public repo: Repository<Permission>,
  ) {
    super(repo);
  }
}
