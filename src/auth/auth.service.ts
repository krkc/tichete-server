import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateAndGetUser(email: string, pass: string): Promise<UserDto> {
    let user: UserDto;
    try {
      user = await this.usersService.findOneByEmail(email);
    } catch (error) {
      this.logger.error(error);
      return null;
    }

    if (!await argon2.verify(user.password, pass)) return null;

    return this.usersService.convertToDto(user);
  }

  async getAuthToken(user: UserDto) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
