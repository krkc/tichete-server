import { InputType } from '@nestjs/graphql';

@InputType()
export class NewCategoryInput {
  name!: string;
}
