import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RESOLVER_TYPE_METADATA, RESOLVER_NAME_METADATA } from '@nestjs/graphql/dist/graphql.constants';
import { AuthGuard } from '@nestjs/passport';
import { Action, CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { REQUIRED_ACTIONS_KEY } from '../../decorators/required-actions.decorator';
import { User } from '../../domain/users/user.entity';
import { Role } from '../../domain/users/roles/role.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const resolverType = this.reflector.get(RESOLVER_TYPE_METADATA, context.getHandler());
    const requiredActions = (resolverType === 'Query') ? [Action.Read] : this.reflector.get<Action[]>(
      REQUIRED_ACTIONS_KEY,
      context.getHandler(),
    ) || [];
    const resourceName = this.reflector.get(RESOLVER_NAME_METADATA, context.getHandler());
    const override = this.reflector.get<boolean | undefined>(
      'override-rejection',
      context.getHandler(),
    );
    if (override) {
      return true;
    }

    return (await super.canActivate(context) && await this.canUserExecuteActions(context, resourceName, requiredActions));
  }

  protected getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  private async canUserExecuteActions(context, resourceName: string, requiredActions: Action[]): Promise<boolean> {
    const user: User = this.getRequest(context).user; // value returned from JwtStrategy.validate()
    const role: Role = await user.role;
    if (role?.isSystemAdmin) return true;

    const ability = await this.caslAbilityFactory.createForUser(user);
    return requiredActions.every((requiredAction) => ability.can(requiredAction, resourceName));
  }
}
