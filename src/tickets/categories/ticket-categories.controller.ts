import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { TicketCategoryDto } from './dto/ticket-category.dto';
import { TicketCategory } from './ticket-category.entity';
import { TicketCategoriesService } from './ticket-categories.service';

@Crud({
  model: {
    type: TicketCategoryDto,
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase']
  },
})
@ApiBearerAuth()
@ApiTags('Ticket Categories')
@Controller('ticket-categories')
export class TicketCategoriesController implements CrudController<TicketCategory> {
  constructor(public readonly service: TicketCategoriesService) {}
}
