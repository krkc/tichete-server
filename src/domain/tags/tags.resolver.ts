import { Injectable } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { TagsService } from './tags.service';
import { Tag } from './tag.entity';
import { createBaseResolver } from '../../base/base.abstract-resolver';
import { NewTagInput } from './dto/new-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';

@Injectable()
@Resolver()
export class TagsResolver extends createBaseResolver(`${Tag.name}s`, Tag, NewTagInput, UpdateTagInput) {
  constructor(
    public readonly service: TagsService
  ) {
    super(service);
  }
}
