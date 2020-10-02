import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { BaseController } from '../base/base.abstract-controller';
import { TicketDto } from './dto/ticket.dto';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';

@Crud({
  model: {
    type: TicketDto,
  },
  routes: BaseController.routesOptions,
})
@ApiBearerAuth()
@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController implements BaseController<Ticket> {
  constructor(public readonly service: TicketsService) {}
}
