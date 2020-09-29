import { UserDto } from "src/users/dto/user.dto";

export class TicketDto {
  name: string;
  description: string;
  creator: UserDto;
}
