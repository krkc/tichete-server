import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { TicketStatusDto } from './dto/ticket-status.dto';
import { TicketStatus } from './ticket-status.entity';
import { TicketStatusesService } from './ticket-statuses.service';

@Crud({
  model: {
    type: TicketStatusDto,
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase']
  },
})
@ApiBearerAuth()
@ApiTags('Ticket Statuses')
@Controller('tickets/statuses')
export class TicketStatusesController implements CrudController<TicketStatus> {
  constructor(public readonly service: TicketStatusesService) {}
}
