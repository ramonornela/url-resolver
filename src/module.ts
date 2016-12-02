import { ModuleWithProviders, NgModule } from '@angular/core';
import { ConfigRoutesToken, Metadata, MetadataBase, Request, Resolve } from './providers';

@NgModule({
  providers: [
    Resolve,
    Request
  ]
})
export class UrlResolverModule {
  static initialize(data?: Object): ModuleWithProviders {
    return {
      ngModule: UrlResolverModule,
      providers: [
        { provide: ConfigRoutesToken, useValue: data },
        { provide: Metadata, useClass: MetadataBase }
      ]
    };
  }
}
