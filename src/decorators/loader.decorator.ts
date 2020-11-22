import { createParamDecorator, ExecutionContext, InternalServerErrorException, PipeTransform, Type } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  isString,
} from '@nestjs/common/utils/shared.utils';
import 'reflect-metadata';
import { DataLoaderInterceptor, NestLoaderContext, LoaderOptions, NEST_LOADER_CONTEXT_KEY } from '../interceptors/nest-data-loader.interceptor';

/**
 * @param loaderName Class name of the custom loader, ex: `MyLoader.name`
 */
export function Loader(
  loaderName: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;

/**
 * @param options Object containing additional data to send to the custom loader
 */
export function Loader(
  options: LoaderOptions,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;

export function Loader(
  stringOrOptions?: string | LoaderOptions,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
  const loaderOptions = getArgsOptions(
    stringOrOptions,
  );

  const decoratorFactory = createParamDecorator(async (data: LoaderOptions, context: ExecutionContext & { [key: string]: any }) => {
    const ctx: any = GqlExecutionContext.create(context).getContext();
    const loaderContext = ctx[NEST_LOADER_CONTEXT_KEY] as NestLoaderContext;
    if (loaderContext === undefined) {
      throw new InternalServerErrorException(`
        You should provide interceptor ${DataLoaderInterceptor.name} globally with ${APP_INTERCEPTOR}
      `);
    }
    return await loaderContext.getLoader(data);
  });
  return decoratorFactory(loaderOptions, ...pipes);
}

function getArgsOptions(
  stringOrOptions: string | LoaderOptions,
): LoaderOptions
{
  let options: LoaderOptions = { loaderName: undefined, data: undefined };
  if (isString(stringOrOptions)) {
    options.loaderName = stringOrOptions;
  } else {
    options = stringOrOptions;
  }
  return options;
}
