import { Controller, Post, Request, SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../domain/users/dto/create-user.dto';
import { UsersService } from '../domain/users/users.service';
import { User } from '../domain/users/user.entity';
import { NewUserInput } from '../domain/users/dto/new-user.input';
import { CurrentUser } from '../decorators/current-user.decorator';

@Resolver('auth')
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {}

  @Mutation(() => User)
  @SetMetadata('override-rejection', true)
  async register(@Args('newUserData') newUserData: NewUserInput) {
    return this.userService.create([newUserData]);
  }

  @Mutation(() => User)
  @SetMetadata('override-rejection', true)
  @UseGuards(LocalAuthGuard)
  login(
    @Args('email') email: string,
    @Args('password') password: string,
    @CurrentUser() user: User
  ) {
    return this.authService.setAuthToken(user);
  }
}
