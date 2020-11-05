import { classToPlain, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { DeepPartial, Repository } from 'typeorm';
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

  async delete(itemIds: number[]): Promise<T[]> {
    const items = await this.repo.find({ where: { id: itemIds } });
    return this.repo.remove(items);
  };

  convertToDto<T>(entity: any, dto: ClassType<T>): T {
    return plainToClass(dto, classToPlain(entity));
  }
}
