import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { Role } from './role.entity';
import { PermissionsService } from './permissions/permissions.service';
import { Permission } from './permissions/permission.entity';
import { PermissionsResolver } from './permissions/permissions.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [RolesService, RolesResolver, PermissionsService, PermissionsResolver],
  exports: [RolesService, PermissionsService],
})
export class RolesModule {}
