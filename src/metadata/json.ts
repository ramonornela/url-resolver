import { MetadataBase } from './metadata-base';
import { Injectable } from '@angular/core';
import { BrowserXhr } from '@angular/http';

@Injectable()
export class JsonMetadata extends MetadataBase {

  constructor(private file: string, private xhr: BrowserXhr) {
    super();
  }

  getData() {

    if (this._data === null || this._data === undefined) {
      let _xhr = this.xhr.build();
      _xhr.open('GET', this.file, false);
      _xhr.reponseType = 'json';
      _xhr.addEventListener('load', () => {
        try {
          this._data = JSON.parse(_xhr.responseText);
        } catch (err) {
          throw 'Sintaxe erro arquivo de rota ' + err.message;
        }
      });
      _xhr.addEventListener('error', () => {
        throw 'Arquivo de rota inexistente ' + this.file;
      });
      _xhr.send();
    }

    return this._data;
  }
}
