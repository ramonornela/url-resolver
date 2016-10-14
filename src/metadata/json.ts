import { MetadataBase } from './metadata-base';
import { Injectable, NgZone } from '@angular/core';
import { Json } from '@angular/core/src/facade/lang';
import { BrowserXhr } from '@angular/http';

@Injectable()
export class JsonMetadata extends MetadataBase {

  constructor(private file: string, private xhr: BrowserXhr, private zone: NgZone) {
    super();
  }

  getData() {

    if (this._data === null || this._data === undefined) {

      this.zone.runOutsideAngular(() => {
        let _xhr = this.xhr.build();
        _xhr.open('GET', this.file, false);
        _xhr.reponseType = 'json';
        _xhr.addEventListener('load', () => {
          this._data = Json.parse(_xhr.responseText);
        });
        _xhr.send();
      });
    }

    return this._data;
  }
}
