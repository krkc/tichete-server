import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Roles } from '../decorators/roles.decorator';
import { Base } from './base.abstract-entity';
import { BaseService } from './base.abstract-service';
import { PaginationArgs } from './pagination.args';

function decapitalizeFirstLetter(string) {
  return string[0].toLocaleLowerCase() + string.slice(1);
}

export function createBaseResolver<TResource extends Base, TNewInputType>(
  suffix: string,
  resourceCls: ClassType<TResource>,
  newInputCls: ClassType<TNewInputType>
) {
  const resourceName = decapitalizeFirstLetter(resourceCls.name);
  const resourcesName = decapitalizeFirstLetter(suffix);
  const pubSub = new PubSub();

  @Resolver(of => resourceCls, { isAbstract: true })
  abstract class BaseResolver {
    constructor(
      protected readonly service: BaseService<TResource>
    ) {}

    @Query(() => resourceCls, { name: resourceName })
    protected async getOne(@Args("id", { type: () => Int} ) id: number) {
      return this.service.findOne(id);
    }

    @Query(() => [resourceCls], { name: resourcesName })
    protected async getAll(@Args() args: PaginationArgs): Promise<TResource[]> {
      return this.service.findAll(args);
    }

    @Roles('Administrator')
    @Mutation(() => [resourceCls], { name: `add${resourceCls.name}` })
    async create(
      @Args(`new${resourceCls.name}Data`, { type: () => [newInputCls]}) inputTypeCls: TNewInputType[],
    ): Promise<TResource[]> {
      const resources = await this.service.create(inputTypeCls);
      pubSub.publish(`${resourceCls.name}Added`, { resourceAdded: resources });
      return resources as any as TResource[];
    }

    @Roles('Administrator')
    @Mutation(() => [resourceCls], { name: `remove${resourceCls.name}` })
    async delete(
      @Args(`${resourceName}Ids`, { type: () => [Int]}) resourceIds: number[],
    ): Promise<TResource[]> {
      const resources = await this.service.delete(resourceIds);
      pubSub.publish(`${resourceCls.name}Removed`, { resourcesRemoved: resources });
      return resources as any as TResource[];
    }
  }

  return BaseResolver;
}
