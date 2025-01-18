'use client';

import { useWallet } from '@coin98-com/wallet-adapter-react';
import { Root, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Button } from '@repo/ui';
import { get, reverse, sortBy } from 'lodash';
import React, { useEffect } from 'react';
import BaseAPI from '../../axios';
import { useCheckHub } from '../../context/checkHubContext';
import { handleListenEvent } from '../../hooks/useEmitEvents';
import {
  convertWeiToBalance,
  formatAddress,
  formatReadableNumber,
} from '../../utils';

const CopyTraderItem = ({
  item,
  callback,
}: {
  item: any;
  callback: (data: any) => void;
}) => {
  const { onGetPrivateKey, privateKey } = useCheckHub();

  const handleConfirmCopyTrade = async () => {
    if (!privateKey) {
      const privateKeyRes = await onGetPrivateKey();
      if (!privateKeyRes) return;
    }
    //TODO: toast error

    console.log('listen' + item.address);
    handleListenEvent(item.address, callback);
  };

  return (
    <div className="border-2 border-white/40 bg-gradient-to-b from-yellow-500/20 to-black/40 rounded-lg shadow-lg w-full p-2 px-4">
      <div className="text-lg font-bold text-white mb-4">
        Address: {formatAddress(item?.address)}
      </div>
      <div className="flex w-full justify-between items-end">
        <div>
          <div className="">
            ROI: <span className="text-sm border rounded-xl px-2">3d</span>
          </div>
          {item.roi >= 0 ? (
            <div className="text-3xl font-semibold text-green-500 mb-2">
              {formatReadableNumber(item?.roi * 100)}%
            </div>
          ) : (
            <div className="text-3xl font-semibold text-red-500 mb-2">
              {formatReadableNumber(item?.roi * 100)}%
            </div>
          )}
          {/* <div className="">
            ROI: <span className="text-sm border rounded-xl px-2">12d</span>
          </div>
          <div className="text-xl font-semibold mb-2 text-green-500">
            +440.4%
          </div> */}
        </div>
        <Button
          className="float-end font-bold"
          size="lg"
          onClick={handleConfirmCopyTrade}
        >
          Copy Trade
        </Button>
      </div>
    </div>
  );
};

const CopyTrade = () => {
  const { address } = useWallet();
  console.log('🚀 ~ CopyTrade ~ address:', address);
  const { privateKey } = useCheckHub();
  const [traders, setTraders] = React.useState<any[]>([]);
  const [tradingHistories, setTradingHistories] = React.useState<any[]>([]);

  const onExecuteTrade = async (event: any) => {
    BaseAPI({
      method: 'POST',
      url: '/swap',
      payload: {
        tokenIn: {
          address: '0xc55e93c62874d8100dbd2dfe307edc1036ad5434',
          decimals: 18,
        },
        tokenOut: {
          address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
          decimals: 6,
        },
        amountIn: 200,
        senderAddress: '0x09D0A2963D27B27C234b3637C528eCB9356B8867',
      },
    }).then((res) => {
      //TODO: check
      setTradingHistories((prev) => [...prev, res as any]);
    });
  };

  useEffect(() => {
    BaseAPI({ method: 'GET', url: '/trades' }).then((res: any) => {
      setTraders(res.data);
    });

    if (!privateKey) {
      return;
    }
  }, [privateKey]);
  console.log('🚀 ~ CopyTrade ~ traders:', traders);

  return (
    <div>
      {/* <div>Connected address: {formatAddress(address)}</div> */}

      <Root defaultValue="list">
        <TabsList className="flex gap-4 text-xl mb-4">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="text-xl font-bold mb-4">Trader List:</div>
          <div className="flex flex-col gap-4">
            {reverse(sortBy(traders, 'roi'))?.map((item) => (
              <CopyTraderItem
                key={item}
                item={item}
                callback={() => onExecuteTrade(item)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="history">
          <TradingHistory tradingHistories={tradingHistories} />
        </TabsContent>
      </Root>
    </div>
  );
};

const TradingHistoryItem = ({ item }: { item: any }) => {
  return (
    <div className="border-2 border-white/40 bg-gradient-to-b from-yellow-500/20 to-black/40 rounded-lg shadow-lg w-full p-2 px-4">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={get(item, 'tokenIn.logo')} alt="" className="w-8" />
          <div>
            <div className="font-bold -mb-1">
              {formatReadableNumber(
                convertWeiToBalance(
                  get(item, 'dataToSwap.amountIn', ''),
                  get(item, 'tokenIn.decimals', '6')
                ).toString()
              )}
            </div>
            <div className="text-sm">
              {get(item, 'tokenIn.symbol', '').toUpperCase()}
            </div>
          </div>
        </div>
        <div className="text-xl opacity-60">➜</div>
        <div className="flex items-center gap-2">
          <img src={get(item, 'tokenOut.logo')} alt="" className="w-8" />
          <div>
            <div className="font-bold -mb-1">
              {formatReadableNumber(
                convertWeiToBalance(
                  get(item, 'dataToSwap.amountOut', ''),
                  get(item, 'tokenOut.decimals', '6')
                ).toString()
              )}
            </div>
            <div className="text-sm">
              {get(item, 'tokenOut.symbol', '').toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TradingHistory = ({ tradingHistories }: { tradingHistories: any[] }) => {
  return (
    <>
      <div className="text-xl font-bold mb-4">Trader List:</div>
      <div className="flex flex-col gap-4">
        {Array(4)
          .fill({
            tokenIn: {
              address: '0xc55e93c62874d8100dbd2dfe307edc1036ad5434',
              address_label: null,
              name: 'Moo BIFI',
              symbol: 'mooBIFI',
              decimals: '18',
              logo: 'https://logo.moralis.io/0x2105_0xc55e93c62874d8100dbd2dfe307edc1036ad5434_2485da82a00c70ab0434b2037f6be524.png',
              logo_hash: null,
              thumbnail:
                'https://logo.moralis.io/0x2105_0xc55e93c62874d8100dbd2dfe307edc1036ad5434_2485da82a00c70ab0434b2037f6be524.png',
              total_supply: '719189425116169634948',
              total_supply_formatted: '719.189425116169634948',
              fully_diluted_valuation: '0',
              block_number: '5523491',
              validated: 1,
              created_at: '2023-10-20T21:12:09.000Z',
              possible_spam: false,
              verified_contract: true,
              categories: [],
              links: {
                moralis:
                  'https://moralis.com/chain/base/token/price/0xc55e93c62874d8100dbd2dfe307edc1036ad5434',
              },
              security_score: 43,
              description: null,
            },
            tokenOut: {
              address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
              address_label: null,
              name: 'USD Coin',
              symbol: 'USDC',
              decimals: '6',
              logo: 'https://logo.moralis.io/0x2105_0x833589fcd6edb6e08f4c7c32d4f71b54bda02913_0453dd33499ce791c760a31264256b10.png',
              logo_hash: null,
              thumbnail:
                'https://logo.moralis.io/0x2105_0x833589fcd6edb6e08f4c7c32d4f71b54bda02913_0453dd33499ce791c760a31264256b10.png',
              total_supply: '3482792091274470',
              total_supply_formatted: '3482792091.27447',
              fully_diluted_valuation: '3477215917.61',
              block_number: '2797221',
              validated: 1,
              created_at: '2023-08-18T18:36:29.000Z',
              possible_spam: false,
              verified_contract: true,
              categories: [],
              links: {
                moralis:
                  'https://moralis.com/chain/base/token/price/0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
              },
              security_score: null,
              description: null,
            },
            dataToSwap: {
              amountIn: '200000000000000000000',
              amountInUsd: '0',
              amountOut: '69450086727',
              amountOutUsd: '69789.55745818304',
              gas: '343000',
              gasUsd: '0.00804962362423482',
              additionalCostUsd: '0',
              additionalCostMessage: '',
              outputChange: {
                amount: '0',
                percent: 0,
                level: 0,
              },
              routerAddress: '0x6131B5fae19EA4f9D964eAc0408E4408b66337b5',
              transactionValue: '0',
            },
          })
          .map((item, index) => (
            <TradingHistoryItem key={index} item={item} />
          ))}
      </div>
    </>
  );
};

export default CopyTrade;
