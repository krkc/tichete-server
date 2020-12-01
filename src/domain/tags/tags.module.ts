import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsResolver } from './tags.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core/constants';
import { Tag } from './tag.entity';
import { DataLoaderInterceptor } from '../../interceptors/nest-data-loader.interceptor';
import { TagLoader } from '../../dataloaders/tags.loader';
import { ModuleRef } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])
],
  providers: [
    TagsService,
    TagsResolver,
    TagLoader,
    {
      provide: APP_INTERCEPTOR,
      useFactory: (moduleRef: ModuleRef) => new DataLoaderInterceptor(moduleRef, Tag.name),
      inject: [ModuleRef]
    },
  ],
  exports: [TagsService]
})
export class TagsModule {}
