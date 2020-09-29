import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { TicketDto } from './dto/ticket.dto';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';

@Crud({
  model: {
    type: TicketDto,
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase']
  },
})
@ApiBearerAuth()
@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController implements CrudController<Ticket> {
  constructor(public readonly service: TicketsService) {}

  @ApiOperation({ summary: 'Retrieve the user who created a ticket' })
  @Get('/:id/users')
  async getTicketCreator(@Param('id') id: number) {
    return this.service.getTicketCreator(id);
  }
}
