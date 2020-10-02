import { Injectable, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import { RolesService } from '../../../src/users/roles/roles.service';
import { UsersService } from '../../../src/users/users.service';
import commandLineArgs from 'command-line-args';
import { CreateRoleDto } from '../../users/roles/dto/create-role.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { RoleDto } from '../../users/roles/dto/role.dto';

export interface CommandLineArgsOptions extends commandLineArgs.CommandLineOptions {
  truncate: boolean;
  merchants: number;
}

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService
  ) { }
  public async run(args: CommandLineArgsOptions) {
    if (args.prod) {
      return await this.seedProd();
    }
    return;
  }

  private async seedProd() {
    try {
      await this.adminUser();
    } catch (error) {
      this.logger.error('Failed seeding users...');
      throw error;
    }

    this.logger.debug('Production Seeding complete.');
  }

  private async adminUser() {
    const adminRole = await this.adminRole();

    const adminUser = await this.usersService.findOne('1');
    if (adminUser) {
      this.logger.debug('Admin user already exists, skipping.');
      return adminUser;
    }

    const createAdminUser = new CreateUserDto();
    createAdminUser.email = 'admin@site.com';
    createAdminUser.password = await argon2.hash('password');
    createAdminUser.firstName = 'Site';
    createAdminUser.lastName = 'Admin';
    createAdminUser.roleId = adminRole.id;

    await this.usersService.repo.save(createAdminUser);
    await new Promise(resolve => setTimeout(resolve, 500)); // https://github.com/nestjs/typeorm/issues/646
    this.logger.debug('Admin user created.');
  }

  private async adminRole() {
    const adminRole = await this.rolesService.findOne('1');
    if (adminRole) {
      this.logger.debug('Admin role already exists, skipping.');
      return adminRole;
    }

    const createAdminRole = new CreateRoleDto();
    createAdminRole.name = 'Administrator';

    const createdRole = this.rolesService.convertToDto(await this.rolesService.repo.save(createAdminRole), RoleDto);
    this.logger.debug('Admin role created.'); // or .verbose()

    return createdRole;
  }
}
