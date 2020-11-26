import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../domain/users/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
  ) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const override = this.reflector.get<boolean | undefined>(
      'override-rejection',
      context.getHandler(),
    );
    if (override) {
      return true;
    }

    return (await super.canActivate(context) && await this.isUserInRole(context));
  }

  protected getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  private async isUserInRole(context) {
    const roleNames = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roleNames) return true;

    const user: User = this.getRequest(context).user; // value returned from JwtStrategy.validate()
    return roleNames.includes((await user.role).name);
  }
}
