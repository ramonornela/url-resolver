import { Injectable } from '@angular/core';
import { Headers, Request as RequestAngular, URLSearchParams } from '@angular/http';
import { Metadata } from './metadata/metadata';
import { Resolve } from './resolve';

/**
 *
 */
@Injectable()
export class Request {

  protected defaultOptions: any = {};

  constructor(protected resolve: Resolve) {}

  getResolve(): Resolve {
    return this.resolve;
  }

  getMetadata(): Metadata  {
    return this.getResolve().getMetadata();
  }

  create(id: string, params?: Object, options: any = {}): RequestAngular {
    let defaultOptions = Object.assign({}, this.defaultOptions);
    options = Object.assign(defaultOptions, options);

    // merge headers
    options.headers = options.headers || {};
    let headersDefault = this.getMetadata().getHeaders(id);
    for (let index in options.headers) {
      headersDefault[index] = options.headers[index];
    }

    let copyParams = Object.assign({}, params);

    Object.assign(options, {
      method: options.method || this.getMetadata().getMethod(id),
      url: this.resolve.url(id, copyParams),
      headers: new Headers(headersDefault)
    });

    if (copyParams && Object.keys(copyParams).length) {
      this.serializeParams(id, options, copyParams);
    }

    return new RequestAngular(options);
  }

  setDefaultOptions(options: any) {
    this.defaultOptions = options;
  }

  protected serializeParams(id: string, options: any, params: Object) {

    switch (options.method) {
      case 'GET':
      case 'DELETE':
        // validate params
        this.resolve.validateParams(id, Object.assign({}, params), true);
        options.search = this.createSearchParams(params);
        break;
      case 'POST':
      case 'PUT':
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

  protected createSearchParams(params: Object): URLSearchParams {
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
