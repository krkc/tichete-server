import { Injectable } from '@nestjs/common';
import { TagsService } from '../domain/tags/tags.service';
import { Tag } from '../domain/tags/tag.entity';
import { BaseLoader } from './base.loader';

@Injectable()
export class TagLoader extends BaseLoader<Tag> {
  constructor(tagsService: TagsService) {
    super(tagsService);
  }
}
