import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateTicketStatusInput {
  id?: number;
  name!: string;
}
