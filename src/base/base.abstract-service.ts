import { classToPlain, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Repository, In, DeepPartial } from 'typeorm';
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
    return this.repo.save(this.repo.create(data) as any as DeepPartial<T>[]);
  }

  async update(data: any[]): Promise<T[]> {
    return this.repo.save(this.repo.create(data) as any as DeepPartial<T>[]);
  }

  async delete(itemIds: number[]): Promise<number[]> {
    const items = await this.repo.find({ where: { id: In(itemIds) } });
    await this.repo.remove(items);
    return itemIds;
  };

  convertToDto<T>(entity: any, dto: ClassType<T>): T {
    return plainToClass(dto, classToPlain(entity));
  }

  protected async resolveRelationships(resource: T, inputData: any, relationships: string[]) {
    return null;
  }
}
