import { ConfigModule, Config } from '@ramonornela/configuration';
import { NgModule } from '@angular/core';
import { Resolve, Request, Metadata, MetadataBase } from './providers';

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
