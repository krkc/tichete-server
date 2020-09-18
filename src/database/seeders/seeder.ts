import { Injectable, Logger } from '@nestjs/common';
import { User } from '../../../src/users/user.entity';
import * as argon2 from 'argon2';
import { Role } from '../../../src/roles/role.entity';
import { RolesService } from '../../../src/roles/roles.service';
import { UsersService } from '../../../src/users/users.service';
import commandLineArgs from 'command-line-args';

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
      await this.seedProd();
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
    
    this.logger.debug('Successfuly completed seeding users...');
  }

  private async adminUser() {
    const createdRole = await this.adminRole();

    const adminUser = new User();
    adminUser.email = 'admin@site.com';
    adminUser.password = await argon2.hash('password');
    adminUser.firstName = 'Site';
    adminUser.lastName = 'Admin';
    adminUser.role = createdRole;

    const newUser = await this.usersService.create(adminUser);
    this.logger.debug('Admin user created.');

    return newUser;
  }

  private async adminRole() {
    const adminRole = new Role();
    adminRole.name = 'Administrator';

    const createdRole = await this.rolesService.create(adminRole)
    this.logger.debug('Admin role created.'); // or .verbose()

    return createdRole;
  }
}
