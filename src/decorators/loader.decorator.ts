import { createParamDecorator, ExecutionContext, InternalServerErrorException, PipeTransform, Type } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import 'reflect-metadata';
import { DataLoaderInterceptor, NestLoaderContext, LoaderOptions, NEST_LOADER_CONTEXT_KEY } from '../interceptors/nest-data-loader.interceptor';

/**
 * @param loaderOptions Object containing additional data to send to the custom loader
 */
export function Loader(
  loaderOptions: LoaderOptions,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
  const decoratorFactory = createParamDecorator(async (data: LoaderOptions, context: ExecutionContext & { [key: string]: any }) => {
    const ctx: any = GqlExecutionContext.create(context).getContext();
    const loaderContext = ctx[`${NEST_LOADER_CONTEXT_KEY}_${data.relName}`] as NestLoaderContext;
    if (loaderContext === undefined) {
      throw new InternalServerErrorException(`
        You should provide interceptor ${DataLoaderInterceptor.name} globally with ${APP_INTERCEPTOR}
      `);
    }
    return await loaderContext.getLoader(data);
  });
  return decoratorFactory(loaderOptions, ...pipes);
}
