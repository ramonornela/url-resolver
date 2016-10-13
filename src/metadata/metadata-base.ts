import { HTTP_METHODS, Params } from './data-type';
import { Metadata } from './metadata-abstract';

const KEY_DEFINE = '__defines__';

export abstract class MetadataBase implements Metadata {

  protected _data: any;

  abstract getData(): any;

  protected _get(id: string): any {
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

    if (data[key] === null || data[key] === undefined) {
      data[key] = {};
    }

    let defines = this.getDefine(key);
    for (let index in defines) {
      if (data[key][index] === null || data[key][index] === undefined) {
        data[key][index] = defines[index];
      }
    }

    return data;
  }

  protected getDefine(key: string) {
    let data = this.getData();

    if ((data[KEY_DEFINE] !== null && data[KEY_DEFINE] !== undefined) && 
        (data[KEY_DEFINE][key] !== null && data[KEY_DEFINE][key] !== undefined)) {
      return data[KEY_DEFINE][key];
    }

    return null;
  }
}
