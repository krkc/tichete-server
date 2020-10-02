import { CrudController, RoutesOptions } from '@nestjsx/crud';
import { BaseService } from './base.abstract-service';

export abstract class BaseController<T> implements CrudController<T> {
  public static readonly routesOptions: RoutesOptions = {
    exclude: ['createManyBase', 'replaceOneBase']
  };

  constructor(
    public readonly service: BaseService<T>
  ) {}
}
