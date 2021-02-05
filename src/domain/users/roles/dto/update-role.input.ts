import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput {
  id?: number;

  name!: string;
  isSystemAdmin!: boolean;
}
