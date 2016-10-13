import { HTTP_METHODS, Params } from './data-type';
import { Metadata } from './metadata-abstract';
import { isUndefined, isPresent, isBlank } from 'ionic-angular/util/util';

const KEY_DEFINE = '__defines__';

export abstract class MetadataBase implements Metadata {

  protected _data: any;

  abstract getData(): any;

  protected _get(id: string): any {
    let allData = this.getData();

    if (isUndefined(allData[id])) {
      throw 'Identificador inexistente no arquivo de rota';
    }

    return allData[id];
  }

  getMethod(id: string): HTTP_METHODS {

    let allData = this.getData();

    if (isUndefined(allData[id].method)) {
      return 'GET';
    }

    return allData[id].method;
  }

  getUrl(id: string): string {
    let data = this._get(id),
        host = this.getDefine('host') || '',
        url  = data.url;

    if (url.indexOf('http') === -1) {
      url = host.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
    }

    return url;
  }

  getParams(id: string): {[name: string]: Params} {
    let data = this._get(id);
    return data.params;
  }

  getParamsGlobals(): any {
    return this.getDefine('params');
  }

  getHeaders(id?: string): {[key: string]: any} {
    let data = id ? this._get(id) : {},
        dataMerge;

    dataMerge = this.mergeDefines(data, 'headers');

    return dataMerge.headers;
  }

  protected mergeDefines(data: Object, key: string): any {

    if (isBlank(data[key])) {
      data[key] = {};
    }

    let defines = this.getDefine(key);
    for (let index in defines) {
      if (isBlank(data[key][index])) {
        data[key][index] = defines[index];
      }
    }

    return data;
  }

  protected getDefine(key: string) {
    let data = this.getData();

    if (isPresent(data[KEY_DEFINE]) && isPresent(data[KEY_DEFINE])) {
      return data[KEY_DEFINE][key];
    }

    return null;
  }
}
