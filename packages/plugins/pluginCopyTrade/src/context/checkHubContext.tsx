'use client';

import { useWallet } from '@coin98-com/wallet-adapter-react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useKeyStore } from '../stores/privateKeyStore';

interface ICheckHubProps {
  children: React.ReactElement;
}

type CheckHubValue = {
  privateKey?: string;
  onGetPrivateKey: () => Promise<string>;
};

const HUB_NAME = '@coin98/export_key';
const SIGN_MESSAGE = 'Sign this message for add hubs ' + HUB_NAME;

const CheckHub = createContext<CheckHubValue>({} as CheckHubValue);

export const CheckHubProvider = ({ children }: ICheckHubProps) => {
  const { address, provider, signMessage } = useWallet();
  const { setPrivateKey, privateKey } = useKeyStore();

  const onSignMessage = async () => {
    //TODO: check sign message
    return await signMessage(SIGN_MESSAGE);
  };

  const checkHubs = useCallback(async () => {
    const response = await (provider as any).request({
      method: 'wallet_checkHubs',
      params: [
        {
          package: HUB_NAME,
          version: '0.0.1',
          address,
        },
      ],
    });
    //      const privateKey = await onGetPrivateKey(address);
    // setPrivateKey(privateKey);
    if (!response) {
      const response = await (provider as any).request({
        method: 'wallet_addHubs',
        params: [
          {
            package: '@coin98/export_key',
            version: '0.0.1',
            description: 'This package export private key from extension',
          },
        ],
      });
      console.log('🚀 ~ response ~ response:', response);
      // await onSignMessage(address);
    }
  }, [address]);

  const onGetPrivateKey = useCallback(async () => {
    try {
      console.log('🚀 ~ onGetPrivateKey ~ address:', address);
      const response = await (provider as any).request({
        method: 'wallet_getPrivateKey',
        params: [address],
      });
      console.log('🚀 ~ response ~ response:', address, response);

      setPrivateKey(response);
      return response;
    } catch (e) {
      console.log('🚀 ~ onGetPrivateKey ~ e', e);
    }
  }, [address]);

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ address:', address);

    if (!address) return;
    checkHubs().then((data) => console.log(data));
  }, [address]);

  return (
    <CheckHub.Provider value={{ privateKey, onGetPrivateKey }}>
      {children}
    </CheckHub.Provider>
  );
};

export const useCheckHub = () => useContext(CheckHub);
