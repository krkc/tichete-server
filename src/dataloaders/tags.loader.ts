import * as DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';
import { NestDataLoader } from '../interceptors/nest-data-loader.interceptor';
import { TagsService } from '../domain/tags/tags.service';
import { Tag } from '../domain/tags/tag.entity';

@Injectable()
export class TagLoader implements NestDataLoader<string, Tag[]> {
  private keyColumnName: string;
  constructor(private readonly tagsService: TagsService) { }

  generateDataLoader({ keyColumnName }) {
    this.keyColumnName = keyColumnName;
    return new DataLoader<string, Tag[]>(async (keys) => {
      const tags = await this.tagsService.repo.createQueryBuilder()
        .where(`${this.keyColumnName} IN (:...keys)`, { keys })
        .getMany();
      const tagsMap = {};
      tags.forEach(tag => {
        const ticketId = tag[this.keyColumnName];
        tagsMap[ticketId] = tagsMap[ticketId] || [];
        tagsMap[ticketId].push(tag);
      });
      return keys.map(key => tagsMap[key]);
    });
  }
}
