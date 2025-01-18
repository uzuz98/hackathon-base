'use client';

import { useWallet } from '@coin98-com/wallet-adapter-react';
import React, { useEffect } from 'react';
import BaseAPI from '../../axios';
import { useCheckHub } from '../../context/checkHubContext';
import { Button } from '@repo/ui';

const CopyTraderItem = () => {
  const handleJoin = async () => {};
  return (
    <div className="bg-gray-900 flex flex-col justify-center items-center text-white">
      <div className="bg-gradient-to-tr from-yellow-500/20 to-black/40 rounded-lg shadow-lg w-full p-2 px-4">
        <div className="text-lg font-bold text-white">Address: 0x2</div>
        <p className="mb-8">ROI: 100%</p>
        <Button className="float-end">Join</Button>
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
      <div>Copy Trader</div>
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <CopyTraderItem key={item} />
        ))}
      </div>
    </div>
  );
};

export default CopyTrade;
