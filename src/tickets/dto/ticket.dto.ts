import { UserDto } from "src/users/dto/user.dto";
import { TicketStatusDto } from "../statuses/dto/ticket-status.dto";

export class TicketDto {
  name: string;
  description: string;
  creator: UserDto;
  status: TicketStatusDto;
}
