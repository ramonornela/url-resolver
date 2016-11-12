import { Injectable } from '@angular/core';
import { Request as RequestAngular, Headers, URLSearchParams } from '@angular/http';
import { Resolve } from './resolve';

/**
 *
 * @usage
 * ```ts
 * ```
 */
@Injectable()
export class Request {
  constructor(private resolve: Resolve) {
  }

  create(id: string, params?: Object, headers?: {[key: string]: any}, body?: any): RequestAngular {
    // merge headers
    let headersDefault = this.resolve.getMetadata().getHeaders(id);
    if (typeof headers === 'object') {
      for (let index in headers) {
        headersDefault[index] = headers[index];
      }
    }

    let options: any = {
      method: this.resolve.getMetadata().getMethod(id),
      url: this.resolve.url(id, params),
      headers: new Headers(headersDefault),
      body: body
    };

    if (params && Object.keys(params).length) {
      this.serializeParams(id, options, params);
    }

    return new RequestAngular(options);
  }

  private serializeParams(id: string, options: any, params: Object) {

    switch (options.method) {
      case 'GET':
      case 'DELETE':
        // validacao dos parametros
        this.resolve.validateParams(id, Object.assign({}, params), true);
        options.search = this.createSearchParams(params);
        break;
      case 'POST':
        if (!options.body) {
          // @todo analisar a possibilidade de implementar conversão de params de acordo com o tipo
          options.body = params;
          let contentType = options.headers.get('content-type');
          if (!contentType) {
            options.body = this.createSearchParams(params);
          }
        }

        break;
    }
  }

  private createSearchParams(params: Object): URLSearchParams {
    let search = new URLSearchParams('');
    for (let param in params) {
      // @todo implementar append
      if (typeof params[param] === 'object') {
        search.set(param, JSON.stringify(params[param]));
      } else {
        search.set(param, params[param]);
      }
    }

    return search;
  }
}
