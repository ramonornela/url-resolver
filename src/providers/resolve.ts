import { Injectable } from '@angular/core';
import { Metadata } from './metadata/metadata';

@Injectable()
export class Resolve {

  private preffixVariable: string = '{';

  private suffixVariable: string = '}';

  constructor(protected metadata: Metadata) {}

  getMetadata() {
    return this.metadata;
  }

  setPreffixVariable(preffix: string): this {
    this.preffixVariable = preffix;
    return this;
  }

  setSuffixVariable(suffix: string): this {
    this.suffixVariable = suffix;
    return this;
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
    let paramsGlobals = this.metadata.getDefaults('params');

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

    url = this.replaceUrlParamsGlobalsDefaultValue(paramsGlobals, url);
    url = this.replaceUrlVariables(url);
    url = this.replaceUrlHost(url);

    // delete params not required
    let regex = new RegExp('(?:(:?(:?\\?|&)[\\w\\-]+=)|\\/)\\' + this.preffixVariable + '[\\w\\-]+\\' + this.suffixVariable, 'g');
    url = url.replace(regex, '');

    return url;
  }

  replaceUrl(url: string, index: string, value: any, params?: Object, paramsLeftOver?: Array<string>) {
    let variable = '\\' + this.preffixVariable + index + '\\' + this.suffixVariable,
        regex = new RegExp(variable, 'g'),
        urlPrevious = url;

    // replace on url
    if (value !== null && value !== undefined) {
      url = url.replace(regex, value);
    }

    // parameters not exists on url are deleted
    if (!urlPrevious.match(regex) && Array.isArray(paramsLeftOver)) {
      paramsLeftOver.push(index);
    } else if (urlPrevious.match(regex) && (typeof params === 'object')) {
      delete params[index];
    }

    return url;
  }

  private replaceUrlParamsGlobalsDefaultValue(paramsGlobals: any, url: string): string {
    for (let paramGlobal in paramsGlobals) {
      if (paramsGlobals[paramGlobal]['default'] !== null) {
        url = this.replaceUrl(url, paramGlobal, paramsGlobals[paramGlobal]['default']);
      }
    }

    return url;
  }

  private replaceUrlVariables(url: string): string {
    let variables = this.metadata.getDefaults('variables');

    for (let variableName in variables) {
      url = this.replaceUrl(url, variableName, variables[variableName]);
    }

    return url;
  }

  private replaceUrlHost(url: string): string {
    // replace host
    let host = this.metadata.getDefaults('host') || '';

    if (url.indexOf('http') === -1) {
      url = host.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
    }

    return url;
  }

  validateParamsGlobals(params: Object) {
    this._validateParams(this.metadata.getDefaults('params'), params, true);
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

    if ((defaultValue !== null && defaultValue !== undefined) && (params[param] === null || params[param] === undefined)) {
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
    if (typeof params[param] !== type && (params[param] !== null && params[param] !== undefined)) {
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
