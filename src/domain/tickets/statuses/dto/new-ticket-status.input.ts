import { InputType } from '@nestjs/graphql';

@InputType()
export class NewTicketStatusInput {
  name!: string;
}
