import { Controller, Post, Request, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {}

  @Post('register')
  @SetMetadata('override-rejection', true)
  @ApiBody({ type: CreateUserDto })
  register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @SetMetadata('override-rejection', true)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserDto })
  login(@Request() req) {
    return this.authService.getAuthToken(req.user);
  }
}
