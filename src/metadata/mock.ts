import { MetadataBase } from './metadata-base';
import { Injectable } from '@angular/core';

@Injectable()
export class MockMedata extends MetadataBase {

  constructor(mockData: Object) {
    super();
    this._data = mockData;
  }

  getData() {
    return this._data;
  }
}
