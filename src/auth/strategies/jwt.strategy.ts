import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../domain/users/user.entity';
import { UsersService } from '../../domain/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('APP_JWT_SECRET')
    });
  }

  /**
   * Validate the user's web token
   *
   * @param payload sub: Subject, iat: issued at, exp: expires at
   * @throws {UnauthorizedException} If the user credentials are incorrect
   */
  async validate(payload: {sub: number, iat: number, exp: number}): Promise<User> {
    const user = this.usersService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
