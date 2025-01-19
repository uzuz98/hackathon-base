import { toast } from 'react-toastify';
import Web3 from 'web3';
import BaseAPI from '../axios';

const KYPER_SWAP = '0x6131B5fae19EA4f9D964eAc0408E4408b66337b5';
const KYPER_TOPIC =
  '0x095e66fa4dd6a6f7b43fb8444a7bd0edb870508c7abf639bc216efb0bcff9779';

export const handleListenEvent = (
  address: string = '',
  callback: (data: any) => void
) => {
  const client = new Web3(
    new Web3.providers.WebsocketProvider('wss://base.gateway.tenderly.co')
  );

  client.eth
    .subscribe('logs', {
      address: KYPER_SWAP,
      topics: [KYPER_TOPIC],
    })
    .on('connected', (subscriptionId: string) => {
      console.log('🩲 🩲 => .on => subscriptionId:', subscriptionId);
    })
    .on('data', async (data: any) => {
      const rawTxsData = await waiter(() =>
        client.eth.getTransaction(data.transactionHash)
      );

      if (address.toLowerCase() !== rawTxsData.from?.toLowerCase()) return;

      await sleep(2000);

      BaseAPI({
        method: 'POST',
        url: '/trade',
        payload: { transaction: rawTxsData },
      }).then((res: any) => {
        if (!res.data) return;

        toast('New trade executed', { type: 'info' });
        callback({
          ...res.data,
          from: rawTxsData.from
        });
      });
    });
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const waiter = async <T>(
  callback: () => Promise<T>,
  msTimeout = 30000,
  msInterval = 1000,
  errorMessage = '',
  isCatchErrorInterval = true
): Promise<T> => {
  const now = Date.now();

  return new Promise<T>((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        const isExpired = Date.now() - now >= msTimeout;

        if (isExpired) {
          timer && clearInterval(timer);
          reject(new Error(errorMessage || 'Timeout when waiting'));
        }

        const result = await callback();

        if (result) {
          timer && clearInterval(timer);
          resolve(result);
        }
      } catch (error: any) {
        if (isCatchErrorInterval) {
          clearInterval(timer);
          reject(new Error(error.message || 'Error when waiting'));
        }
      }
    }, msInterval);
  });
};
