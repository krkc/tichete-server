import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { ModuleRef, ContextIdFactory, ContextId } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as DataLoader from 'dataloader';
import { Observable } from 'rxjs';

/**
 * Used to generate the initial data loader.
 * The concrete implementation should be added as a provider to your module.
 */
export interface NestDataLoader<ID, Type> {
  /**
   * Returns a new instance of dataloader
   *
   * @param data The optional data that was provided in the `@Loader()` decorator
   */
  generateDataLoader(data: any): DataLoader<ID, Type>;
}

/**
 * Options that can be passed to `@Loader()` decorator.
 */
export interface LoaderOptions {
  /**
   * Class name of the relationship
   */
  relName: string;
  /**
   * Class name of the custom loader
   */
  loaderName: string;
  /**
   * Additional data to send to the custom loader
   */
  data?: any;
}
export interface NestLoaderContext { contextId: ContextId, getLoader: (loaderOptions: LoaderOptions) => Promise<NestDataLoader<any,any>> }

/**
 * Context key where get loader function will be stored.
 * This class should be added to your module providers like so:
 * {
 *     provide: APP_INTERCEPTOR,
 *     useClass: DataLoaderInterceptor,
 * },
 */
export const NEST_LOADER_CONTEXT_KEY = "NEST_LOADER_CONTEXT_KEY";

@Injectable()
export class DataLoaderInterceptor implements NestInterceptor {
  constructor(private readonly moduleRef: ModuleRef, private className: string) { }
  /**
   * @inheritdoc
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const graphqlExecutionContext = GqlExecutionContext.create(context);
    const ctx = graphqlExecutionContext.getContext();
    const contextKey = `${NEST_LOADER_CONTEXT_KEY}_${this.className}`;

    if (ctx[contextKey] === undefined) {
      ctx[contextKey] = {
        contextId: ContextIdFactory.create(),
        getLoader: (loaderData: LoaderOptions) : Promise<NestDataLoader<any, any>> => {
          if (ctx[loaderData.loaderName] === undefined) {
            try {
              ctx[loaderData.loaderName] = (async () => {
                return (await this.moduleRef.resolve<NestDataLoader<any, any>>(loaderData.loaderName, ctx[contextKey].contextId, { strict: false }))
                  .generateDataLoader(loaderData.data);
              })();
            } catch (e) {
              throw new InternalServerErrorException(`The loader ${loaderData.loaderName} is not provided` + e);
            }
          }
          return ctx[loaderData.loaderName];
        }
      } as NestLoaderContext;
    }
    return next.handle();
  }
}
