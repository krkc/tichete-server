import * as DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';
import { NestDataLoader } from '../interceptors/nest-data-loader.interceptor';
import { BaseService } from '../base/base.abstract-service';
import { Base } from '../base/base.abstract-entity';

@Injectable()
export abstract class BaseLoader<TRelated extends Base> implements NestDataLoader<string, TRelated[]> {
  private sourceKeyColumnName: string;
  constructor(protected readonly relationshipService: BaseService<TRelated>) { }

  generateDataLoader({ keyColumnName }) {
    this.sourceKeyColumnName = keyColumnName;
    return new DataLoader<string, TRelated[]>(async (keys) => {
      const relatedResources = await this.relationshipService.repo.createQueryBuilder()
        .where(`${this.sourceKeyColumnName} IN (:...keys)`, { keys })
        .getMany();
      const resourceMap = {};
      relatedResources.forEach(relatedResource => {
        const sourceId = relatedResource[this.sourceKeyColumnName];
        resourceMap[sourceId] = resourceMap[sourceId] || [];
        resourceMap[sourceId].push(relatedResource);
      });
      return keys.map(key => resourceMap[key]);
    });
  }
}
