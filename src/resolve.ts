import { Injectable } from '@angular/core';
import { Metadata } from './metadata/metadata';

@Injectable()
export class Resolve {
  constructor(private metadata: Metadata) {
  }

  url(id: string, params?: Object): string {
    params = params || {};

    let paramsLeftOver: Array<string> = [];

    // valida parametros e preenche valor default
    this.validateParams(id, params);

    // realiza replace da url
    let url: string = this.metadata.getUrl(id);
    for (let index in params) {
      url = this.replaceUrl(
        url,
        index,
        params[index],
        params,
        paramsLeftOver
      );
    }

    if (params && Object.keys(params).length) {
      // valida parametros globais
      this.validateParamsGlobals(params);
      // retorna parametros gloais __defines__
      let paramsGlobals = this.metadata.getParamsGlobals();

      // realiza replace de parametros globais
      for (let paramGlobal in paramsGlobals) {
        if (paramsLeftOver.indexOf(paramGlobal) !== -1 && params[paramGlobal]) {
          url = this.replaceUrl(url, paramGlobal, params[paramGlobal], params);
        }
      }
    }

    return url;
  }

  replaceUrl(url: string, index: string, value: any, params: Object, paramsLeftOver?: Array<string>) {
    let regex = new RegExp('\\$' + index, 'g'),
        urlPrevious = url;

    paramsLeftOver = paramsLeftOver || [];

    // realiza replace dos parametros
    url = url.replace(regex, value);

    // se os parametros não existirem na url são excluidos
    if (!urlPrevious.match(regex)) {
      paramsLeftOver.push(index);
    } else if (urlPrevious.match(regex)) {
      delete params[index];
    }

    return url;
  }

  getMetadata(): Metadata {
    return this.metadata;
  }

  validateParamsGlobals(params: Object) {
    this._validateParams(this.metadata.getParamsGlobals(), params, true);
  }

  validateParams(id: string, params: Object, onlyAssign?: boolean) {
    this._validateParams(this.metadata.getParams(id), params, onlyAssign);
  }

  private _validateParams(paramsIds: any, params: Object, onlyAssign?: boolean, id?: string) {
    for (let param in paramsIds) {
      // pula parametros não presentes no objeto, validando somente os parametros informados
      if (onlyAssign && !(param in params)) {
        continue;
      }

      // atribui valor padrão
      this.setDefaultValue(paramsIds, param, params);

      // realiza validação de tipo dado, requerido e regex
      this.validates(paramsIds, param, params);
    }
  }

  private setDefaultValue(paramsIds: any, param: string, params: Object): void {
    let defaultValue;

    if (paramsIds[param] === null || paramsIds[param] === undefined) {
      throw 'Parametro ' + param + ' inexistente';
    }

    defaultValue = paramsIds[param].default;

    if (params[param] === null || params[param] === undefined) {
      params[param] = defaultValue;
    }
  }

  private validates(paramsIds: any, param: string, params: Object): boolean {

    let require, type;

    if (paramsIds[param] === null || paramsIds[param] === undefined) {
      throw 'Parametro inexistente.';
    }

    // valida por tipo de dado
    type = paramsIds[param].type || 'string';

    if (typeof params[param] !== type) {
      throw 'Tipo de dado invalido parametro: ' + param + ' tipo ' + (typeof params[param]);
    }

    // valida parametro requerido
    require = paramsIds[param].required || false;
    if (require) {
      if (params[param] === null || params[param] === undefined) {
        throw 'Parametro ' + param + ' é requerido.';
      }
    }

    // validação por regex
    if (paramsIds[param].validation) {
      let validation: any = paramsIds[param].validation;
      switch (true) {
        case validation instanceof RegExp:
          if (!params[param].toString().match(validation)) { // força conversão para string para validação da regex
            throw 'Parametro deve seguir o padrão ' + validation;
          }
          break;
        case Array.isArray(validation):
          if (validation.indexOf(params[param]) === -1) {
            throw 'Parametro deve  ser (' + validation.join(',') + ')';
          }
          break;
      }
    }

    return true;
  }
}
