import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsResolver } from './assignments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment]),
],
  providers: [AssignmentsService, AssignmentsResolver],
  exports: [AssignmentsService]
})
export class AssignmentsModule {}
