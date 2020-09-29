import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
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
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
      inject: [Reflector],
    },
    LocalStrategy,
    JwtStrategy
  ],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
