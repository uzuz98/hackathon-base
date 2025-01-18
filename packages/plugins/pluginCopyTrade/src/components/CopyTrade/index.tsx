'use client';

import React from 'react';

const CopyTraderItem = () => {
  return (
    <div className="rounded-xl border p-2">
      <div className="">Address: 0x22</div>
      <div className="">Roi: 100%</div>
    </div>
  );
};

const CopyTrade = () => {
  // const { address } = useWallet();
  // const { privateKey } = useKeyStore();
  // useCheckHub();

  // const handleSwap = async () => {
  //   const web3 = new Web3('');
  //   const tx = {};
  //   const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

  //   await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  // };

  // useEffect(() => {
  //   if (!privateKey) {
  //     return;
  //   }
  //   handleSwap();
  // }, [privateKey]);

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
