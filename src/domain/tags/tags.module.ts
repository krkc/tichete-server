import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsResolver } from './tags.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])
],
  providers: [TagsService, TagsResolver],
  exports: [TagsService]
})
export class TagsModule {}
