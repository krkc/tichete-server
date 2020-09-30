import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketCategory } from './ticket-category.entity';
import { TicketCategoriesController } from './ticket-categories.controller';
import { TicketCategoriesService } from './ticket-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketCategory])],
  providers: [TicketCategoriesService],
  exports: [TicketCategoriesService],
  controllers: [TicketCategoriesController],
})
export class TicketCategoriesModule {}
