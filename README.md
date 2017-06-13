# UrlResolverModule

This allow define configuration of objects request

## Using HttpModule in an Ionic 2 app

```typescript
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

// import url-resolver module
import { UrlResolverModule } from '@mbamobi/url-resolver';

export const APP_ROUTE = {
  '_defaults': {
    'host': 'http://api.example.com/'
  },
  'user': {
    'url': 'user/{id}',
    'method': 'GET',
    'headers': {
      'content-type': 'application/json'
    },
    'params': {
      'id': {
        'type': 'number',
        'required': true
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    UrlResolverModule.initialize(APP_ROUTE),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ]
})
export class AppModule {}
```

Contributing

See [CONTRIBUTING.md](https://github.com/mbamobi/url-resolver/blob/master/.github/CONTRIBUTING.md)
