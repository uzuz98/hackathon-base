import Web3 from 'web3';

const KYPER_SWAP = '0x6131B5fae19EA4f9D964eAc0408E4408b66337b5';
const KYPER_TOPIC =
  '0xddac40937f35385a34f721af292e5a83fc5b840f722bff57c2fc71adba708c48';

export const handleListenEvent = (
  address: string = '',
  callback: (rawTxsData: any) => void
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
      if (address.toLowerCase() !== data.address?.toLowerCase()) return;

      console.log('🩲 🩲 => .on => data:', data);
      const rawTxsData = await client.eth.getTransaction(data.transactionHash);
      console.log('🚀 ~ .on ~ rawTxsData:', rawTxsData);
      console.log('🩲 🩲 => .on => data:', rawTxsData.input);

      //TODO: call api to convert
      callback(rawTxsData);
    });
};
