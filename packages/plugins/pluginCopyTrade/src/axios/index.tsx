import { AxiosInstance } from 'axios';
import { get } from 'lodash';
import { ApiConfig, ErrorResponse, RequestMethod, Response } from '../apis';
import { BaseInstance } from './instance';

// Helper functions
export const getDataError = (error: any): ErrorResponse => ({
  status: get(error, 'response.data.status', 500),
  message: get(error, 'response.data.message', String(error)),
});

// Base API creation function
const createBaseAPI = (api: AxiosInstance) => {
  api.interceptors.request.use(async (config) => {
    config.headers.Accept = 'application/json';
    config.headers['content-type'] = 'application/json';

    return config;
  });

  return api;
};

// API method factory
const createApiMethod =
  (instance: AxiosInstance) =>
  async <DataType,>({
    method,
    url,
    payload = {},
  }: ApiConfig): Promise<Response<DataType | null>> => {
    const api = createBaseAPI(instance);

    const methodRequest = method.toLowerCase() as RequestMethod;

    try {
      const response = await api[methodRequest](url, payload);

      return {
        data: get(response, 'data', null),
        success: get(response, 'success', false),
        status: get(response, 'status', 500),
      };
    } catch (error) {
      const errorResponse = getDataError(error);

      return {
        data: null,
        success: false,
        ...errorResponse,
      };
    }
  };

// Main BaseAPI object
const BaseAPI = createApiMethod(BaseInstance);

export default BaseAPI;
