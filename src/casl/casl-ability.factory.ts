import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User } from "../domain/users/user.entity";

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
export type AppAbility = Ability<[Action, string]>;

@Injectable()
export class CaslAbilityFactory {
  async createForUser(user: User) {
    const ruleBuilder = new AbilityBuilder<
      Ability<[Action, string]>
    >(Ability as AbilityClass<AppAbility>);
    const permissions = await (await user.role).permissions;
    for (const permission of permissions) {
      const resourceName = permission.resourceName;

      let condition: any;
      if (permission.creatorOnly) {
        condition = { userId: user.id };
      }
      if (permission.canCreate) {
        ruleBuilder.can(Action.Create, resourceName, condition);
      }
      if (permission.canRead) {
        ruleBuilder.can(Action.Read, resourceName, condition);
      }
      if (permission.canUpdate) {
        ruleBuilder.can(Action.Update, resourceName, condition);
      }
      if (permission.canDelete) {
        ruleBuilder.can(Action.Delete, resourceName, condition);
      }
    }

    return ruleBuilder.build();
  }
}
