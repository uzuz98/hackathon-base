// import axios, {
//   AxiosError,
//   AxiosInstance,
//   AxiosResponse,
//   CreateAxiosDefaults,
//   InternalAxiosRequestConfig,
// } from 'axios';

// import { IGateway, REQUEST_TYPE } from '../types/apis';

// type Config = CreateAxiosDefaults & {
//   headers: {
//     signature?: string;
//     onChainSignature?: string;
//   };
// };

// export class ApiService {
//   static async getData<T>({
//     type,
//     endpoint,
//     queryBody,
//     linkServer,
//     signal,
//     options,
//   }: Omit<IGateway, 'body'>) {
//     return this.postGateway<T>({
//       method: REQUEST_TYPE.GET,
//       type,
//       endpoint,
//       linkServer,
//       queryBody,
//       options,
//       signal,
//     });
//   }

//   static async postData<T>({
//     type,
//     endpoint,
//     body,
//     linkServer,
//     options,
//     signal,
//   }: Omit<IGateway, 'queryBody'>) {
//     return this.postGateway<T>({
//       method: REQUEST_TYPE.POST,
//       endpoint,
//       body,
//       linkServer,
//       options,
//       signal,
//     });
//   }

//   static async putData<T>({
//     type,
//     endpoint,
//     body,
//   }: Pick<IGateway, 'endpoint' | 'body'>) {
//     return this.postGateway<T>({
//       method: REQUEST_TYPE.PUT,
//       endpoint,
//       body,
//     });
//   }

//   static async deleteData<T>({
//     endpoint,
//     queryBody,
//   }: Pick<IGateway, 'endpoint' | 'queryBody'>) {
//     return this.postGateway<T>({
//       method: REQUEST_TYPE.DELETE,
//       endpoint,
//       queryBody,
//     });
//   }

//   static async postGateway<T>({
//     endpoint,
//     method = REQUEST_TYPE.GET,
//     body,
//     linkServer,
//     queryBody,
//     signal,
//     options,
//   }: IGateway) {
//     try {
//       try {
//         if (typeof window !== 'undefined') {
//           // const activeWallet = useWalletStore.getState().activeWallet;
//           // const activeAddress = activeWallet ? activeWallet.address : '';
//           // signature = getSignatureByWallet(activeAddress);
//           // token = getCookie(
//           //   type !== ADAPTER_TYPE.BASE_ADAPTER
//           //     ? KEY_STORE.JWT_TOKEN
//           //     : KEY_STORE.JWT_TOKEN_ADAPTER
//           // );
//           // isConnectWallet = Boolean(signature);
//         } else {
//           // const parsedCookie = parseCookie(options);
//           // signature = parsedCookie[KEY_STORE.SIGNATURE];
//           // token = parsedCookie[KEY_STORE.JWT_TOKEN_ADAPTER];
//           // signature = '';
//           // token = '';
//           // isConnectWallet = false;
//         }
//       } catch (error) {}

//       const config: Config = {
//         timeout: 60000,
//         headers: {
//           os: 'extension',
//           Accept: 'application/json',
//           // 'User-Agent': `DM Mozilla/5.0, KR dagora/1.0.1 ID (Macintosh ; Intel Mac OS X 10_15_7 web-dagora) Iphone-dagora DMKRIDKWE`,
//           // 'Content-Type': 'application/json',
//         },
//       };

//       // if (signature) {
//       //   config.headers.onChainSignature = signature;
//       // }

//       const axiosInstance = this.setupInterceptors(axios.create(config));

//       const response: AxiosResponse = await axiosInstance[method](
//         endpoint,
//         body
//       );

//       // const data =
//       //   'success' in get(response, 'data') ? response.data.data : response.data;

//       let finalData = get(response, 'data');

//       if (typeof finalData === 'object' && finalData.success) {
//         finalData = finalData.data;
//       }

//       return finalData;
//     } catch (err: any) {
//       return Promise.reject(
//         err.response?.data?.data?.errMess || err.message || 'error_system'
//       );
//     }
//   }

//   static setupInterceptors(axiosInstance: AxiosInstance): AxiosInstance {
//     axiosInstance.interceptors.request.use(
//       this.onRequest,
//       this.onErrorResponse
//     );
//     axiosInstance.interceptors.response.use(
//       this.onResponse,
//       this.onErrorResponse
//     );
//     return axiosInstance;
//   }

//   static onRequest(
//     config: InternalAxiosRequestConfig
//   ): InternalAxiosRequestConfig {
//     return config;
//   }

//   static onResponse(response: AxiosResponse): AxiosResponse {
//     return response;
//   }

//   static onErrorResponse(error: AxiosError | Error): Promise<AxiosError> {
//     console.log('error: ', error);
//     // check case blocked ip
//     if (Number(get(error, 'response.status')) === 451) {
//       if (typeof window !== 'undefined')
//         window.location.href = '/country-restricted';
//       // return;
//     }

//     return Promise.reject(error);
//   }
// }
