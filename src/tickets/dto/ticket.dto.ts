import { UserDto } from "../../users/dto/user.dto";
import { TicketCategoryDto } from '../categories/dto/ticket-category.dto';
import { TicketStatusDto } from "../statuses/dto/ticket-status.dto";

export class TicketDto {
  name: string;
  description: string;
  creator: UserDto;
  status: TicketStatusDto;
  taggedCategories: TicketCategoryDto[];
}
