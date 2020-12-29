import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewPermissionInput {
  resourceName!: string;
  creatorOnly!: boolean;

  canCreate?: boolean;
  canRead?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;

  @Field(() => Int)
  roleId!: number;
}
