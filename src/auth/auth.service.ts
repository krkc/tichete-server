import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../domain/users/user.entity';
import { UsersService } from '../domain/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateAndGetUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.repo.findOne({email});
    if (!user || !await this.usersService.isPasswordCorrect(user.id, pass)) {
      return null;
    }

    return user;
  }

  async setAuthToken(user: User) {
    const payload = { sub: user.id };
    user.accessToken = this.jwtService.sign(payload);
    return user;
  }
}
