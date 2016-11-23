import { Params, HTTP_METHODS } from './data-type';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class Metadata {
  abstract get(id: string): any;
  abstract has(id: string): boolean;
  abstract getMethod(id: string): HTTP_METHODS;
  abstract getUrl(id: string): string;
  abstract setParams(id: string, params: Array<{[name: string]: Params}>): this;
  abstract addParam(id: string, param: {[name: string]: Params}): this;
  abstract getParams(id: string): {[name: string]: Params};
  abstract setHeaders(id: string, headers: Array<{[key: string]: any}>): this;
  abstract addHeader(id: string, param: {[name: string]: Params}): this;
  abstract getHeaders(id: string): {[key: string]: any};
  abstract setDefaults(key: string, defaults: any): this;
  abstract addDefaults(key: string, defaults: any): this;
  abstract getDefaults(key: string): any;
}
