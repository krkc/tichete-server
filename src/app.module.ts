import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { configService } from './config/config.service';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UsersModule,
    RolesModule
  ],
  controllers: [AppController],
})
export class AppModule {}
