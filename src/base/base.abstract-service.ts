import { classToPlain, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Repository, In } from 'typeorm';
import { Base } from './base.abstract-entity';
import { PaginationArgs } from './pagination.args';

export abstract class BaseService<T extends Base> {
  constructor(
    public repo: Repository<T>
  ) {}

  async findOne(id: number): Promise<T> {
    return this.repo.findOne(id);
  }

  async findAll(args: PaginationArgs): Promise<T[]> {
    return this.repo.find({skip: args?.skip, take: args?.take});
  }

  async create(data: any[]): Promise<T[]> {
    return this.repo.save(data);
  }

  async update(data: any[]): Promise<T[]> {
    return this.repo.save(data);
  }

  async delete(itemIds: number[]): Promise<T[]> {
    const items = await this.repo.find({ where: { id: In(itemIds) } });
    return this.repo.remove(items);
  };

  convertToDto<T>(entity: any, dto: ClassType<T>): T {
    return plainToClass(dto, classToPlain(entity));
  }

  protected async resolveRelationships(resource: T, inputData: any, relationships: string[]) {
    return null;
  }
}
