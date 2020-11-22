import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsResolver } from './tags.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Tag } from './tag.entity';
import { DataLoaderInterceptor } from '../../interceptors/nest-data-loader.interceptor';
import { TagLoader } from '../../dataloaders/tags.loader';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])
],
  providers: [
    TagsService,
    TagsResolver,
    TagLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
  exports: [TagsService]
})
export class TagsModule {}
