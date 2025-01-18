// PancakeSwap Router ABI (you need to include the event ABI)
const pancakeSwapAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        name: 'amount0In',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'amount1In',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'amount0Out',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'amount1Out',
        type: 'uint256',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
    ],
    name: 'Swap',
    type: 'event',
  },
]

export default pancakeSwapAbi
