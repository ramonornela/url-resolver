export type HTTP_METHODS = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'OPTIONS' | 'DELETE';

export interface Params {
  type: string;
  required?: boolean;
  validation?: string;
  default?: boolean;
}
