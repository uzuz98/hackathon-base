import { GenericAbortSignal } from 'axios';

export enum REQUEST_TYPE {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

export interface IGateway {
  endpoint: string;
  method?: REQUEST_TYPE;
  body?: any;
  queryBody?: any;
  linkServer?: string;
  options?: any;
  signal?: GenericAbortSignal;
}
