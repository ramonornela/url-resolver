import { Injectable } from '@angular/core';
import { Request as RequestAngular, Headers, URLSearchParams } from '@angular/http';
import { Resolve } from './resolve';

/**
 * Classe responsável por criar objeto Request para uso do provider Http
 *
 * @usage
 * ```ts
 * import { Component } from '@angular/core';
 * import { Request } from './providers';
 *
 * @Component({
 *   template: '<ion-nav  #content swipeBackEnabled="true"></ion-nav>',
 *   providers: [factoryMetadata('assets/routes/dev.json')]
 * })
 * export class MyApp {
 *   constructor() {
 *   }
 * }
 * ```
 */
@Injectable()
export class Request {
  constructor(private resolve: Resolve) {
  }

  /**
   * Cria objeto request de acordo com o objeto Metadata configurado
   *
   * @param {string} id Identificador do objeto metadata de onde serao retornadas as informações como url, headers ...
   * @param {?Object} params Parametros para replace no atributo url do Metadata ou que serao utilizados como querystring ou body
   * @param {?Object} headers Cabecalhos extras além dos ja configurados no atributo headers do Metadata
   * @param {?any} body
   * @return Request
   */
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

    // caso parametros seja vazio ignora serialização
    if (params && Object.keys(params).length) {
      this.serializeParams(id, options, params);
    }

    return new RequestAngular(options);
  }

  /**
   * Serializa parametros e valida os mesmos a serem enviados como GET ou POST no objeto Request
   *
   * @param {string} id Identificador do objeto metadata
   * @param {any} options Opcoes do objeto Request
   * @param {?Object} params Parametros para replace no atributo url do Metadata ou que serao utilizados como querystring ou body
   * @return void
   */
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

  /**
   * Cria objeto para serializacao
   *
   * @param {string} id Identificador do objeto metadata
   * @param {any} options Opcoes do objeto Request
   * @param {?Object} params Parametros para replace no atributo url do Metadata ou que serao utilizados como querystring ou body
   * @return void
   */
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
