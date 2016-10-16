import { NgModule, ModuleWithProviders, OpaqueToken } from '@angular/core';
import { HttpModule, BrowserXhr } from '@angular/http';
import { Resolve } from './resolve';
import { RequestFactory } from './factory';
import { Metadata } from './metadata/metadata';
import { JsonMetadata } from './metadata/json';
import { MockMetadata } from './metadata/mock';

export function factoryMockMetadata(data: any): MockMetadata {
  return new MockMetadata(data);
}

export function factoryJsonMetadata(data: any, xhr: BrowserXhr): JsonMetadata {
  return new JsonMetadata(data, xhr);
}

export const RouteToken = new OpaqueToken('ROUTETOKEN');

@NgModule({
  imports: [
    HttpModule
  ]
})
export class UrlResolverModule {
  static initialize(data: Object | string): ModuleWithProviders {
    let factory: Function;
    switch (true) {
      case typeof data === 'string' && data.indexOf('.json') !== -1:
        factory = factoryJsonMetadata;
        break;
      case typeof data === 'object':
        factory = factoryMockMetadata;
        break;
      default:
        throw 'Argumento inválido';
    }

    return {
      ngModule: UrlResolverModule,
      providers: [
        Resolve,
        {provide: RouteToken, useValue: data},
        {provide: Metadata, useFactory: factory, deps: [RouteToken, BrowserXhr]},
        RequestFactory
      ]
    };
  }
}
