import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsResolver } from './assignments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './assignment.entity';
import { AssignmentLoader } from '../../dataloaders/assignments.loader';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';
import { DataLoaderInterceptor } from 'src/interceptors/nest-data-loader.interceptor';
import { ModuleRef } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment]),
],
  providers: [
    AssignmentsService,
    AssignmentsResolver,
    AssignmentLoader,
    {
      provide: APP_INTERCEPTOR,
      useFactory: (moduleRef: ModuleRef) => new DataLoaderInterceptor(moduleRef, Assignment.name),
      inject: [ModuleRef]
    },
  ],
  exports: [AssignmentsService]
})
export class AssignmentsModule {}
