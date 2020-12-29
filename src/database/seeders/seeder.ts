import { Injectable, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import { RolesService } from '../../domain/users/roles/roles.service';
import { UsersService } from '../../domain/users/users.service';
import commandLineArgs from 'command-line-args';
import { NewRoleInput } from '../../domain/users/roles/dto/new-role.input';
import { NewUserInput } from '../../domain/users/dto/new-user.input';

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

    const adminUser = await this.usersService.findOne(1);
    if (adminUser) {
      this.logger.debug('Admin user already exists, skipping.');
      return adminUser;
    }

    await this.usersService.create([
      {
        email: 'admin@site.com',
        password: await argon2.hash('password'),
        firstName: 'Site',
        lastName: 'Admin',
        roleId: adminRole.id,
      } as NewUserInput
    ]);
    await new Promise(resolve => setTimeout(resolve, 500)); // https://github.com/nestjs/typeorm/issues/646
    this.logger.debug('Admin user created.');
  }

  private async adminRole() {
    const adminRole = await this.rolesService.findOne(1);
    if (adminRole) {
      this.logger.debug('Admin role already exists, skipping.');
      return adminRole;
    }

    const createdRoles = await this.rolesService.create([
      { name: 'Administrator', isSystemAdmin: true } as NewRoleInput,
    ]);
    this.logger.debug('Admin role created.');

    return createdRoles[0];
  }
}
