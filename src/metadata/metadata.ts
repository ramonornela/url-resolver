import { Params, HTTP_METHODS } from './data-type';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class Metadata {
  abstract getMethod(id: string): HTTP_METHODS;
  abstract getUrl(id: string): string;
  abstract getParams(id?: string): {[name: string]: Params};
  abstract getParamsGlobals(): any;
  abstract getHeaders(id?: string): {[key: string]: any};
}
