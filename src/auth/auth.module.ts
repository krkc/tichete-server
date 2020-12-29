import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../domain/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResolver } from './auth.resolver';
import { RolesModule } from '../domain/users/roles/roles.module';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    PassportModule.register({
      session: true,
      defaultStrategy: 'jwt' }
    ),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('APP_JWT_SECRET'),
        signOptions: { expiresIn: '60m' }
      }),
    }),
    CaslModule,
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
      inject: [Reflector],
    },
    LocalStrategy,
    JwtStrategy,
    AuthResolver,
  ],
  exports: [AuthService],
})
export class AuthModule {}
