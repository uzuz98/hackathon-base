import { AxiosInstance, AxiosResponse, Method } from 'axios';

type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
type ApiConfig = { payload?: any; url: string; method: Method };
type ErrorResponse = { status: number; message: string };
type Response<R> = {
  data: R;
  message?: string;
  success: boolean;
  status: number;
};

export type {
  ApiConfig,
  AxiosInstance,
  AxiosResponse,
  ErrorResponse,
  RequestMethod,
  Response,
};
