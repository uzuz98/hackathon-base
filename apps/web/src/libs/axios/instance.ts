import axios, { AxiosInstance } from 'axios'

const RequestInterceptor = async (config: any) => {
  config.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Version: '14.6.3',
    ...config.headers,
  }

  config.transformRequest = (data: any) => {
    return JSON.stringify(data)
  }

  return config
}

const DeveloperErrorHandler = (error: any) => {
  return Promise.reject(error)
}

export const BaseInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 120000,
})

BaseInstance.interceptors.request.use(RequestInterceptor, DeveloperErrorHandler)
