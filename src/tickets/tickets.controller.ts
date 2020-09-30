import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { UserDto } from '../users/dto/user.dto';
import { TicketCategoryDto } from './categories/dto/ticket-category.dto';
import { TicketDto } from './dto/ticket.dto';
import { TicketStatusDto } from './statuses/dto/ticket-status.dto';
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

  @ApiOperation({ summary: 'Set the user who created a ticket' })
  @Post('/:id/creator')
  async setTicketCreator(@Param('id') id: number, @Body() user: UserDto) {
    return this.service.setTicketCreator(id, user);
  }

  @ApiOperation({ summary: 'Set the status of a ticket' })
  @Post('/:id/status')
  async setTicketStatus(@Param('id') id: number, @Body() status: TicketStatusDto) {
    return this.service.setTicketStatus(id, status);
  }

  @ApiOperation({ summary: 'Tag a ticket with a category' })
  @Post('/:id/tags')
  async addTicketTags(@Param('id') id: number, @Body() category: TicketCategoryDto) {
    return this.service.addTicketTag(id, category);
  }
}
