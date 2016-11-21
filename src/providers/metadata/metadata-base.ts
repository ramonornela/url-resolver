import { HTTP_METHODS, Params } from './data-type';
import { Metadata } from './metadata';
import { Config } from '@ramonornela/configuration';

const KEY_DEFAULTS = '_defaults';

const KEY_CONFIG = 'urlResolver';

export class MetadataBase implements Metadata {

  protected data: any;

  constructor(private config: Config) {
  }

  getData(): any {
    if (this.data === undefined || this.data === null) {
      this.data = this.config.get(KEY_CONFIG);
    }

    return this.data;
  }

  protected get(id: string): any {
    let allData = this.getData();

    if (allData[id] === undefined) {
      throw 'Identificador inexistente no arquivo de rota';
    }

    return allData[id];
  }

  getMethod(id: string): HTTP_METHODS {

    let allData = this.getData();

    if (allData[id].method === undefined) {
      return 'GET';
    }

    return allData[id].method;
  }

  getUrl(id: string): string {
    let data = this.get(id);
    return data.url;
  }

  getParams(id: string): {[name: string]: Params} {
    let data = this.get(id);
    return data.params;
  }

  getParamsGlobals(): any {
    return this.getDefaults('params');
  }

  getHeaders(id?: string): {[key: string]: any} {
    let data = id ? this.get(id) : {},
        dataMerge;

    dataMerge = this.mergeDefaults(data, 'headers');

    return dataMerge.headers;
  }

  protected mergeDefaults(data: Object, key: string): any {

    if (data[key] === null || data[key] === undefined) {
      data[key] = {};
    }

    let defaults = this.getDefaults(key);
    for (let index in defaults) {
      if (data[key][index] === null || data[key][index] === undefined) {
        data[key][index] = defaults[index];
      }
    }

    return data;
  }

  getDefaults(key: string): any {
    let data = this.getData();

    if ((data[KEY_DEFAULTS] !== null && data[KEY_DEFAULTS] !== undefined)
       && (data[KEY_DEFAULTS][key] !== null && data[KEY_DEFAULTS][key] !== undefined)) {
      return data[KEY_DEFAULTS][key];
    }

    return null;
  }
}
