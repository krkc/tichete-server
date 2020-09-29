import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from '../../../src/users/roles/roles.module';
import { configService } from "../../config/typeormconfig.service";
import { UsersModule } from "../../../src/users/users.module";
import { Seeder } from "./seeder";

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UsersModule,
    RolesModule
  ],
  providers: [Logger, Seeder],
})
export class SeederModule {}
