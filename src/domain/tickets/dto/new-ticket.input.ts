import { InputType } from '@nestjs/graphql';

@InputType()
export class NewTicketInput {
  description!: string;
  creatorId!: number;
  ticketCategoryIds?: number[];
}
