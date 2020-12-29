import { Injectable } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { createBaseResolver } from '../../../../base/base.abstract-resolver';
import { NewPermissionInput } from './dto/new-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { Permission } from './permission.entity';
import { PermissionsService } from './permissions.service';


@Injectable()
@Resolver()
export class PermissionsResolver extends createBaseResolver(`${Permission.name}s`, Permission, NewPermissionInput, UpdatePermissionInput) {
  constructor(protected readonly service: PermissionsService) {
    super(service)
  }
}
