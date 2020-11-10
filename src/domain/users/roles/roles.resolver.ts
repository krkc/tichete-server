import { Injectable } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from '../../../base/base.abstract-resolver';
import { Role } from './role.entity';
import { RolesService } from './roles.service';
import { NewRoleInput } from './dto/new-role.input';
import { UpdateRoleInput } from './dto/update-role.input';

@Injectable()
@Resolver()
export class RolesResolver extends createBaseResolver(`${Role.name}s`, Role, NewRoleInput, UpdateRoleInput) {
  constructor(protected readonly service: RolesService) {
    super(service)
  }
}
