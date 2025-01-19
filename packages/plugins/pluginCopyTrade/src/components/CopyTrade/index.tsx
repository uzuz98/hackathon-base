import { useWallet } from '@coin98-com/wallet-adapter-react';
import { Root, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Button } from '@repo/ui';
import dayjs from 'dayjs';
import { get, reverse, sortBy } from 'lodash';
import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
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
    toast('Copying...', { type: 'info' });

    if (!privateKey) {
      const privateKeyRes = await onGetPrivateKey();
      if (!privateKeyRes) {
        toast('Something went wrong!', { type: 'error' });
        return;
      }
    }

    console.log('listen' + item.address);
    handleListenEvent(item.address, callback);
    toast('Copied successfully ' + formatAddress(item.address), {
      type: 'success',
    });
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

  // {
  //     "functionName": "swap",
  //     "srcToken": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  //     "dstToken": "0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4",
  //     "dstReceiver": "0xE2906A68908C953B86CBc2D4Cc83913AefAFe117",
  //     "amountIn": "2000000000",
  //     "returnAmount": "412723544247991397381",
  //     "hash": "0xc2cd67ccbd8e88b641a1fc84f8f2b259421c0154154af6c04656c234fda3f0a2"
  // }

  const onExecuteTrade = async (event: any) => {
    BaseAPI({
      method: 'POST',
      url: '/swap',
      payload: {
        tokenIn: {
          address: get(event, 'srcToken'),
        },
        tokenOut: {
          address: get(event, 'dstToken'),
        },
        amountIn: event.amountIn,
        senderAddress: address,
      },
    }).then((res) => {
      //TODO: check
      setTradingHistories((prev) => [
        {
          ...(res.data as any),
          time: dayjs().format('DD-MM-YYYY HH:mm:ss'),
          from: event?.address || ''
        },
        ...prev,
      ]);
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

  return (
    <div>
      {/* <div>Connected address: {formatAddress(address)}</div> */}
      <ToastContainer />

      <Root defaultValue="list">
        <TabsList className="flex gap-4 text-xl mb-4">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="text-xl font-bold mb-4">Trader List:</div>
          <div className="max-h-[600px] overflow-y-scroll">
            <div className="grid grid-cols-2 gap-4">
              {!traders.length && <>Empty</>}
              {reverse(sortBy(traders, 'roi'))?.map((item) => (
                <CopyTraderItem
                  key={item}
                  item={item}
                  callback={onExecuteTrade}
                />
              ))}
            </div>
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
      <div className="text-xs mb-2">{String(item?.time)}</div>
      <div className="text-xs mb-2">{String(item?.from)}</div>
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={get(item, 'tokenIn.logo')} alt="" className="w-8 rounded-full" />
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
          <img src={get(item, 'tokenOut.logo')} alt="" className="w-8 rounded-full" />
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
  if (!tradingHistories.length) {
    return <>Empty</>;
  }
  return (
    <>
      <div className="text-xl font-bold mb-4">History:</div>
      <div className="max-h-[600px] overflow-y-scroll">
        <div className="flex flex-col gap-4">
          {tradingHistories.map((item, index) => (
            <TradingHistoryItem key={index} item={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CopyTrade;
