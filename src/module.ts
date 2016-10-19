import { ConfigModule, Config } from '@ramonornela/configuration';
import { NgModule } from '@angular/core';
import { Resolve } from './resolve';
import { Request } from './request';
import { Metadata } from './metadata/metadata';
import { MetadataBase } from './metadata/metadata-base';

@NgModule({
  imports: [
    ConfigModule
  ],
  providers: [
    Resolve,
    {provide: Metadata, useClass: MetadataBase, deps: [Config]},
    Request
  ]
})
export class UrlResolverModule {
}
