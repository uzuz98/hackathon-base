'use client';

import { useWallet } from '@coin98-com/wallet-adapter-react';
import { Button } from '@repo/ui';
import React, { useEffect } from 'react';
import BaseAPI from '../../axios';
import { useCheckHub } from '../../context/checkHubContext';
import { TabsList, Root, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';

const CopyTraderItem = () => {
  const { onGetPrivateKey } = useCheckHub();
  const handleConfirmCopyTrade = async () => {
    const privateKey = onGetPrivateKey();
    console.log('🚀 ~ handleConfirmCopyTrade ~ privateKey:', privateKey);
  };

  return (
    <div className="border-2 border-white/40 bg-gradient-to-b from-yellow-500/20 to-black/40 rounded-lg shadow-lg w-full p-2 px-4">
      <div className="text-lg font-bold text-white mb-4">Address: 0x2</div>
      <div className="flex w-full justify-between items-end">
        <div>
          <div className="">
            ROI: <span className="text-sm border rounded-xl px-2">7d</span>
          </div>
          <div className="text-3xl font-semibold text-green-500 mb-2">
            +440.4%
          </div>
          <div className="">
            ROI: <span className="text-sm border rounded-xl px-2">12d</span>
          </div>
          <div className="text-xl font-semibold mb-2 text-green-500">
            +440.4%
          </div>
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

  const handleSwap = async () => {
    // const web3 = new Web3('');
    // const tx = {};
    // const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    // await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  };

  useEffect(() => {
    BaseAPI({ method: 'GET', url: '/ping' }).then((res) => {
      console.log(res);
    });
    if (!privateKey) {
      return;
    }

    handleSwap();
  }, [privateKey]);

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
            {[1, 2, 3, 4, 5].map((item) => (
              <CopyTraderItem key={item} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="history">{'history'}</TabsContent>
      </Root>
    </div>
  );
};

export default CopyTrade;
