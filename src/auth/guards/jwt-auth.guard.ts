import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../domain/users/roles/role.entity';
import { RolesService } from '../../domain/users/roles/roles.service';
import { UsersService } from '../../domain/users/users.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {
    super();
  }

  public async canActivate(context: ExecutionContext) {
    const override = this.reflector.get<boolean | undefined>(
      'override-rejection',
      context.getHandler(),
    );
    if (override) {
      return true;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (roles && await super.canActivate(context)) {
      const userId = this.getRequest(context).user.userId;
      const userRole = await this.usersService.repo.findOne({
        relations: ['role'],
        where: { id: userId },
      });

      return this.matchRoles(roles, await userRole.role);
    }

    return !!await super.canActivate(context);
  }

  public handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  protected getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  private matchRoles(roleNames: string[], role: Role) {
    return roleNames.includes(role.name);
  }
}
