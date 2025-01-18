// 'use client';
// import { useWallet } from '@coin98-com/wallet-adapter-react';
// import React, { createContext, useContext, useEffect } from 'react';
// import { useKeyStore } from '../stores/privateKeyStore';

// interface ICheckHubProps {
//   children: React.ReactElement;
// }

// type CheckHubValue = {};

// const HUB_NAME = '@coin98/export_key';
// const SIGN_MESSAGE = 'Sign this message for add hubs ' + HUB_NAME;

// const CheckHub = createContext<CheckHubValue>({} as CheckHubValue);

// export const CheckHubProvider = ({ children }: ICheckHubProps) => {
//   const { address, provider, signMessage } = useWallet();
//   const { setPrivateKey, privateKey } = useKeyStore();

//   const onSignMessage = async (address: string) => {
//     //TODO: check sign message
//     console.log('🚀 ~ onGetPrivateKey ~ address:', address);
//     return await signMessage(SIGN_MESSAGE);
//   };

//   const checkHubs = async (address: string) => {
//     const response = await (provider as any).request({
//       method: 'wallet_checkHubs',
//       params: [
//         {
//           package: HUB_NAME,
//           version: '0.0.1',
//           address,
//         },
//       ],
//     });
//     console.log('🚀 ~ response ~ response:', response);

//     if (response) {
//       const privateKey = await onGetPrivateKey(address);
//       setPrivateKey(privateKey);
//     } else {
//       // await onSignMessage(address);
//     }
//   };

//   const onGetPrivateKey = async (address: string) => {
//     try {
//       console.log('🚀 ~ onGetPrivateKey ~ address:', address);
//       const response = await (provider as any).request({
//         method: 'wallet_getPrivateKey',
//         params: [address],
//       });

//       console.log('🚀 ~ onGetPrivateKey ~ response', response);
//       return response as string;
//     } catch (e) {
//       console.log('🚀 ~ onGetPrivateKey ~ e', e);
//     }
//   };

//   useEffect(() => {
//     if (!address) return;
//     checkHubs(address).then((data) => console.log(data));
//   }, [address]);

//   return <CheckHub.Provider value={{}}>{children}</CheckHub.Provider>;
// };

// export const useCheckHub = () => useContext(CheckHub);
