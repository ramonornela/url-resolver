import { HTTP_METHODS, Params } from './data-type';
import { Metadata } from './metadata';
import { Config } from '@ramonornela/configuration';

const KEY_DEFAULTS = '_defaults';

const KEY_CONFIG = 'urlResolver';

export class MetadataBase implements Metadata {

  protected data: any = {};

  constructor(private config: Config) {}

  protected getData(): any {
    if (this.data === undefined || this.data === null) {
      this.data = this.config.get(KEY_CONFIG);
    }

    return this.data;
  }

  get(id: string): any {
    let allData = this.getData();

    if (allData[id] === undefined) {
      throw 'Identificador inexistente no arquivo de rota';
    }

    return allData[id];
  }

  has(id: string): boolean {
    let allData = this.getData();

    return id in allData;
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

  _set(id: string, key: string, value: any) {
    this.data[id] = this.data[id] || {};
    this.data[id][key] =  value;
  }

  _add(id: string, key: string, value: any) {
    this.data[id] = this.data[id] || {};
    this.data[id][key] = this.data[id][key] || {};
    Object.assign(this.data[id][key], value);
  }

  setParams(id: string, params: Array<{[name: string]: Params}>): this {
    this._set(id, 'params', params);
    return this;
  }

  addParam(id: string, param: {[name: string]: Params}): this {
    this._add(id, 'params', param);
    return this;
  }

  getParams(id: string): {[name: string]: Params} {
    let data = this.get(id);
    return data.params;
  }

  setHeaders(id: string, headers: Array<{[name: string]: Params}>): this {
    this._set(id, 'headers', headers);
    return this;
  }

  addHeader(id: string, header: {[name: string]: Params}): this {
    this._add(id, 'headers', header);
    return this;
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

  setDefaults(key: string, defaults: any): this {
    this._set(KEY_DEFAULTS, key, defaults);
    return this;
  }

  addDefaults(key: string, defaults: any): this {
    this._add(KEY_DEFAULTS, key, defaults);
    return this;
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
