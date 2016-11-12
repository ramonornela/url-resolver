import { Injectable } from '@angular/core';
import { Request as RequestAngular, Headers, URLSearchParams } from '@angular/http';
import { Resolve } from './resolve';

/**
 *
 */
@Injectable()
export class Request {
  constructor(private resolve: Resolve) {}

  create(id: string, params?: Object, options: any = {}): RequestAngular {
    // merge headers
    options.headers = options.headers || {};
    let headersDefault = this.resolve.getMetadata().getHeaders(id);
    for (let index in options.headers) {
      headersDefault[index] = options.headers[index];
    }

    Object.assign(options, {
      method: this.resolve.getMetadata().getMethod(id),
      url: this.resolve.url(id, params),
      headers: new Headers(headersDefault)
    });

    if (params && Object.keys(params).length) {
      this.serializeParams(id, options, params);
    }

    return new RequestAngular(options);
  }

  private serializeParams(id: string, options: any, params: Object) {

    switch (options.method) {
      case 'GET':
      case 'DELETE':
        // validate params
        this.resolve.validateParams(id, Object.assign({}, params), true);
        options.search = this.createSearchParams(params);
        break;
      case 'POST':
        if (!options.body) {
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
      // @todo implements append
      if (typeof params[param] === 'object') {
        search.set(param, JSON.stringify(params[param]));
      } else {
        search.set(param, params[param]);
      }
    }

    return search;
  }
}
