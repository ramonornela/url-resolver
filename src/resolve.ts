import { Injectable } from '@angular/core';
import { Metadata } from './metadata/metadata';

@Injectable()
export class Resolve {
  constructor(private metadata: Metadata) {
  }

  url(id: string, params?: Object): string {
    params = params || {};

    let paramsLeftOver: Array<string> = [];

    this.validateParams(id, params);

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

    // return parameters globals
    let paramsGlobals = this.metadata.getParamsGlobals();

    if (params && Object.keys(params).length) {
      // validate parameters globals
      this.validateParamsGlobals(params);

      // replacements of parameters globals
      for (let paramGlobal in paramsGlobals) {
        if (paramsLeftOver.indexOf(paramGlobal) !== -1 && params[paramGlobal]) {
          url = this.replaceUrl(url, paramGlobal, params[paramGlobal], params);
        }
      }
    }

    // replace params globals with default value
    for (let paramGlobal in paramsGlobals) {
      if (paramsGlobals[paramGlobal]['default'] !== null) {
        url = this.replaceUrl(url, paramGlobal, paramsGlobals[paramGlobal]['default']);
      }
    }

    return url;
  }

  replaceUrl(url: string, index: string, value: any, params?: Object, paramsLeftOver?: Array<string>) {
    let regex = new RegExp('\\$' + index, 'g'),
        urlPrevious = url;

    // replace on url
    url = url.replace(regex, value);

    // parameters not exists on url are deleted
    if (!urlPrevious.match(regex) && Array.isArray(paramsLeftOver)) {
      paramsLeftOver.push(index);
    } else if (urlPrevious.match(regex) && (typeof params === 'object')) {
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
      // skip parameters is not present in object
      if (onlyAssign && !(param in params)) {
        continue;
      }

      // assign default value
      this.setDefaultValue(paramsIds, param, params);

      //  validate by data type, required ...
      this.validates(paramsIds, param, params);
    }
  }

  private setDefaultValue(paramsIds: any, param: string, params: Object): void {
    let defaultValue;

    if (paramsIds[param] === null || paramsIds[param] === undefined) {
      throw 'Parameter ' + param + ' not exists';
    }

    defaultValue = paramsIds[param].default;

    if (params[param] === null || params[param] === undefined) {
      params[param] = defaultValue;
    }
  }

  private validates(paramsIds: any, param: string, params: Object): boolean {

    let require, type;

    if (paramsIds[param] === null || paramsIds[param] === undefined) {
      throw 'Parameter not exists';
    }

    // validate by data type
    type = paramsIds[param].type || 'string';
    if (typeof params[param] !== type) {
      throw 'Data type invalid parameter: ' + param + ' type ' + (typeof params[param]);
    }

    // validate parameter is required
    require = paramsIds[param].required || false;
    if (require) {
      if (params[param] === null || params[param] === undefined) {
        throw 'Parameter ' + param + ' is required.';
      }
    }

    if (paramsIds[param].validation) {
      let validation: any = paramsIds[param].validation;
      switch (true) {
        case typeof validation === 'string':
          let regex = new RegExp(validation);
          if (!regex.test(params[param].toString())) {
            throw 'Parameter should follow the rule ' + validation;
          }
          break;
        case Array.isArray(validation):
          if (validation.indexOf(params[param]) === -1) {
            throw 'Param should be (' + validation.join(',') + ')';
          }
          break;
      }
    }

    return true;
  }
}
