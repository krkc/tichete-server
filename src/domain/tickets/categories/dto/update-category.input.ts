import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryInput {
  id?: number;
  name!: string;
}
