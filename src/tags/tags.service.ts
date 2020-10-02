import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.abstract-service';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagsService extends BaseService<Tag> {
  constructor(
    @InjectRepository(Tag) public repo: Repository<Tag>
  ) {
    super(repo);
  }
}
