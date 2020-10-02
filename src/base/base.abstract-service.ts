import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Repository } from 'typeorm';

export abstract class BaseService<T> extends TypeOrmCrudService<T> {
  constructor(
    public repo: Repository<T>
  ) {
    super(repo);
  }

  convertToDto<T>(entity: any, dto: ClassType<T>): T {
    return plainToClass(dto, classToPlain(entity));
  }
}
