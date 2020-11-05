import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketCategory } from './ticket-category.entity';
import { TicketCategoriesResolver } from './ticket-categories.resolver';
import { TicketCategoriesService } from './ticket-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketCategory])],
  providers: [TicketCategoriesService, TicketCategoriesResolver],
  exports: [TicketCategoriesService],
})
export class TicketCategoriesModule {}
