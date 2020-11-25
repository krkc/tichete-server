import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../domain/users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  /**
   * Validate the user's credentials
   *
   * @throws {UnauthorizedException} If the user credentials are incorrect
   */
  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateAndGetUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
