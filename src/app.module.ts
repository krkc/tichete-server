import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { configService } from './config/typeormconfig.service';
import { RolesModule } from './domain/users/roles/roles.module';
import { UsersModule } from './domain/users/users.module';
import { AuthModule } from './auth/auth.module';
import { TicketsModule } from './domain/tickets/tickets.module';
import { AssignmentsModule } from './domain/assignments/assignments.module';
import { SubscriptionsModule } from './domain/subscriptions/subscriptions.module';
import { TagsModule } from './domain/tags/tags.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'src/schema.gql',
      context: ({ req }) => {
        req.headers.authorization = req.headers.authorization || '';
        return { req };
      },
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    TicketsModule,
    AssignmentsModule,
    SubscriptionsModule,
    TagsModule
  ],
  controllers: [AppController],
})
export class AppModule {}
