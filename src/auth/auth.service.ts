import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    const user = await this.usersService.findOne(email);
    if (!user || !this.usersService.isPasswordCorrect(user.id, pass)) {
      return null;
    }

    return this.usersService.convertToDto(user);
  }

  async getAuthToken(user: UserDto) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
