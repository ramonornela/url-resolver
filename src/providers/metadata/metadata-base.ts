import { Inject, Injectable, OpaqueToken, Optional } from '@angular/core';
import { Config } from '@ramonornela/configuration';
import { HTTP_METHODS, Params } from './data-type';
import { Metadata } from './metadata';

const KEY_DEFAULTS = '_defaults';

const KEY_CONFIG = 'urlResolver';

export const ConfigRoutesToken = new OpaqueToken('CONFIGROUTESTOKEN');

@Injectable()
export class MetadataBase implements Metadata {

  protected data: any = {};

  constructor(@Optional() config: Config, @Optional() @Inject(ConfigRoutesToken) configData: Object) {
    if (typeof config === 'object' && config !== null) {
      this.data = config.get(KEY_CONFIG);
    }

    if (configData) {
      this.data = configData;
    }

    if (this.data !== 'object' && this.data === null) {
      throw new Error('Invalid data type routes');
    }
  }

  protected _set(id: string, key: string, value: any) {
    this.data[id] = this.data[id] || {};
    this.data[id][key] =  value;
  }

  protected _add(id: string, key: string, value: any) {
    this.data[id] = this.data[id] || {};
    this.data[id][key] = this.data[id][key] || {};
    Object.assign(this.data[id][key], value);
  }

  protected _get(id: string, key: string, merge: boolean) {
    let data = this.get(id) || {};

    if (merge) {
      data = this.mergeDefaults(data, key);
    }

    return data[key];
  }

  get(id: string): any {

    if (this.data[id] === undefined) {
      throw `Identificator '${id}' not exists`;
    }

    return this.data[id];
  }

  has(id: string): boolean {
    return id in this.data;
  }

  setMethod(id: string, method: string): this {
    this._set(id, 'method', method);
    return this;
  }

  getMethod(id: string): HTTP_METHODS {
    return this._get(id, 'method', false);
  }

  setUrl(id: string, url: string): this {
    this._set(id, 'url', url);
    return this;
  }

  getUrl(id: string): string {
    return this._get(id, 'url', false);
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
    return this._get(id, 'params', false);
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
    return this._get(id, 'headers', true);
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
    let data = this.data;

    if ((data[KEY_DEFAULTS] !== null && data[KEY_DEFAULTS] !== undefined)
       && (data[KEY_DEFAULTS][key] !== null && data[KEY_DEFAULTS][key] !== undefined)) {
      return data[KEY_DEFAULTS][key];
    }

    return null;
  }
}
