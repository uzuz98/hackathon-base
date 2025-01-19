// const fs = require('fs')
import fs from 'fs'
import { KYBER_ABI } from '../abi/KYBER_ABI'

import Web3 from 'web3'

export enum TIME_FRAME {
  ONE_DAY = 1,
  THREE_DAYS = 3,
  SEVEN_DAYS = 7,
  THIRTY_DAYS = 30,
}

const ADDRESS_TEST = '0xd7eDaF6892cfb6076cc57Ea2880bF4CC6708e3E3'
const API_KEY = 'HZW7E85H77YRNZWBZSRTA3C2V5SZQF9XV1'
const KYBER_NETWORK_ADDRESS = '0x6131B5fae19EA4f9D964eAc0408E4408b66337b5'
const INTERNAL_TRANSACTION = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
const FILES_NAME = 'kyber_transactions.json'
const WRAPED_ETH = '0x4200000000000000000000000000000000000006'

// const RPC = {
//   8453: 'https://base.llamarpc.com',
// }

type RawData = {
  functionName: any
  srcToken: any
  dstToken: any
  dstReceiver: any
  amountIn: any
  returnAmount: any
  hash: any
  timestamp: any
}

// export const genWeb3 = (chain = '8453') => {
//   const web3 = new Web3('https://mainnet.base.org')
//   return web3
// }
export const genWeb3 = () => {
  const web3 = new Web3('https://mainnet.base.org')
  return web3
}

const web3 = genWeb3()

const getAddressTransaction = async (
  address = ADDRESS_TEST,
  page = 1,
  offset = 10,
  startblock = 0,
  endblock = 99999999,
  sort = 'desc',
  apikey = API_KEY,
) => {
  const url = `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=${startblock}&endblock=${endblock}&page=${page}&offset=${offset}&sort=${sort}&apikey=${apikey}`
  const response = await fetch(url)
  const responseData = await response.json()
  return responseData
}

const getInternalTransactionByHash = async (hash: string) => {
  const url = `https://api.basescan.org/api?module=account&action=txlistinternal&txhash=${hash}&apikey=${API_KEY}`
  const response = await fetch(url)
  const responseData = await response.json()
  return responseData
}

const getAddressTransactionInTimeframe = async (timeframe = TIME_FRAME.THIRTY_DAYS, address = ADDRESS_TEST) => {
  const timestampCurrent = new Date().getTime()
  const timestampStart = timestampCurrent - timeframe * 24 * 60 * 60 * 1000
  const offset = 100
  let page = 1
  const data = []
  while (true) {
    const response = await getAddressTransaction(address, page, offset)
    const transactions = response.result
    if (transactions.length === 0) {
      break
    }

    data.push(...transactions)

    // check if the last transaction is in the timeframe
    const lastTransaction = transactions[transactions.length - 1]
    const timestamp = lastTransaction.timeStamp * 1000
    if (timestamp < timestampStart) {
      break
    }

    if (transactions.length < offset) {
      break
    }

    page++
    // wait for a while to avoid being banned
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  // filter the transactions in the timeframe
  const filteredData = data.filter((transaction) => {
    const timestamp = transaction.timeStamp * 1000
    return timestamp >= timestampStart
  })

  return filteredData
}

const filterTransactionByContractAddress = (transactions: any[], contractAddress: string) => {
  return transactions.filter((transaction) => {
    return String(transaction.to).toLowerCase() === String(contractAddress).toLowerCase()
  })
}

const appendToFile = (fileName: string, data: string) => {
  fs.appendFileSync(fileName, data)
}

const readFromFile = (fileName: string) => {
  return fs.readFileSync(fileName, 'utf8')
}

// Decode the input data
export const decodeInput = (abi: any[], data: string) => {
  const functionSignature = data.slice(0, 10) // First 4 bytes (function selector)
  const methodAbi = abi.find(
    (item) => item.type === 'function' && web3.eth.abi.encodeFunctionSignature(item) === functionSignature,
  )

  if (!methodAbi) {
    return null
  }

  const decodedParams = web3.eth.abi.decodeParameters(methodAbi.inputs, data.slice(10))

  return {
    functionName: methodAbi.name,
    params: decodedParams,
  }
}

export const getDataFromRawData = async (transaction: any) => {
  try {
    const data = transaction.input
    const txs = transaction.hash
    try {
      const result = decodeInput(KYBER_ABI, data)

      if (!result) {
        return null
      }

      // console.log("Function Name:", result.functionName);
      // console.log(Object.keys(result.params));
      const params = result.params
      const execution = params.execution || params.desc

      // from the execution, get desc
      const desc = params.desc || (execution as any).desc
      // from desc, get the srcToken, dstToken, dstReceiver, amount(srcToken), minReturnAmount(dstToken)
      const { srcToken, dstToken, dstReceiver, amount, minReturnAmount } = desc

      let dstTokenAdd = dstToken,
        returnAmount = minReturnAmount,
        srcTokenAdd = srcToken,
        amountIn = amount
      if (dstToken === INTERNAL_TRANSACTION) {
        const internalTransactions = await getInternalTransactionByHash(txs)
        const fromToken = internalTransactions.result[0].from
        dstTokenAdd = fromToken
        const value = internalTransactions.result[1].value
        returnAmount = value
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      if (srcToken === INTERNAL_TRANSACTION) {
        const internalTransactions = await getInternalTransactionByHash(txs)
        const toToken = internalTransactions.result[1].to
        srcTokenAdd = toToken
        const value = internalTransactions.result[0].value
        amountIn = value
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      return {
        functionName: result.functionName,
        srcToken: srcTokenAdd,
        dstToken: dstTokenAdd,
        dstReceiver,
        amountIn,
        returnAmount,
        hash: txs,
        timestamp: transaction.timeStamp,
      }
    } catch (error: any) {
      return null
    }
  } catch (error: any) {
    return null
  }
}

const parseRawData = async (timeframe: number, address: string): Promise<RawData[]> => {
  // check if the file exists

  const isFileExists = fs.existsSync(FILES_NAME)
  // if file not exists, create a new file
  if (!isFileExists) {
    const transactions = await getAddressTransactionInTimeframe(timeframe, address)
    const kyberTransactions = filterTransactionByContractAddress(transactions, KYBER_NETWORK_ADDRESS)
    // append to file
    appendToFile(FILES_NAME, JSON.stringify(kyberTransactions))
  }

  // if file exists, read the file
  const kyberTransactions = JSON.parse(readFromFile(FILES_NAME))
  let dataFinal = []
  for (let i = 0; i < kyberTransactions.length; i++) {
    const transaction = kyberTransactions[i]

    const dataTx = await getDataFromRawData(transaction)

    if (dataTx) {
      dataFinal.push(dataTx)
    }

    // try {
    //   const data = transaction.input
    //   const txs = transaction.hash
    //   try {
    //     const result = decodeInput(KYBER_ABI, data)

    //     if (!result) {
    //       throw new Error('No matching function signature found in ABI.')
    //     }
    //     // console.log("Function Name:", result.functionName);
    //     // console.log(Object.keys(result.params));
    //     const params = result.params
    //     const execution = params.execution || params.desc

    //     // from the execution, get desc
    //     const desc = params.desc || (execution as any).desc
    //     // from desc, get the srcToken, dstToken, dstReceiver, amount(srcToken), minReturnAmount(dstToken)
    //     const { srcToken, dstToken, dstReceiver, amount, minReturnAmount } = desc

    //     let dstTokenAdd = dstToken,
    //       returnAmount = minReturnAmount,
    //       srcTokenAdd = srcToken,
    //       amountIn = amount
    //     if (dstToken === INTERNAL_TRANSACTION) {
    //       const internalTransactions = await getInternalTransactionByHash(txs)
    //       const fromToken = internalTransactions.result[0].from
    //       dstTokenAdd = fromToken
    //       const value = internalTransactions.result[1].value
    //       returnAmount = value
    //       await new Promise((resolve) => setTimeout(resolve, 200))
    //     }

    //     if (srcToken === INTERNAL_TRANSACTION) {
    //       const internalTransactions = await getInternalTransactionByHash(txs)
    //       const toToken = internalTransactions.result[1].to
    //       srcTokenAdd = toToken
    //       const value = internalTransactions.result[0].value
    //       amountIn = value
    //       await new Promise((resolve) => setTimeout(resolve, 200))
    //     }

    //     dataFinal.push({
    //       functionName: result.functionName,
    //       srcToken: srcTokenAdd,
    //       dstToken: dstTokenAdd,
    //       dstReceiver,
    //       amountIn,
    //       returnAmount,
    //       hash: txs,
    //       timestamp: transaction.timeStamp,
    //     })
    //   } catch (error: any) {
    //     console.error('Error decoding input data:', error.message)
    //   }
    // } catch (error: any) {
    //   console.error('Error decoding input data:', error.message)
    // }
  }
  return dataFinal
}

export const getData = async (
  time: TIME_FRAME,
): Promise<{
  txs: RawData[]
  roi: number
} | null> => {
  try {
    const dataRaw = await parseRawData(time, ADDRESS_TEST)
    // let unrealizedProfit = 0
    let realizedProfit = 0
    let tempDataRaw = dataRaw || []
    // from each data in dataRaw
    for (let i = 0; i < dataRaw.length; i++) {
      const data = dataRaw[i]
      const tokenInWETH = data.srcToken === WRAPED_ETH
      if (tokenInWETH) {
        const amountIn = web3.utils.fromWei(data.amountIn, 'ether')
        const tokenOut = data.dstToken
        // search for the txs that token in is tokenOut and token out is tokenInWETH
        const txs = tempDataRaw.find((item) => item.srcToken === tokenOut && item.dstToken === WRAPED_ETH)

        if (!txs) {
          continue
        }
        // pop the txs from the tempDataRaw
        tempDataRaw = tempDataRaw.filter((item) => item.hash !== txs.hash)
        const amountOut = web3.utils.fromWei(txs.returnAmount, 'ether')
        const profit = parseFloat(amountOut) - parseFloat(amountIn)
        realizedProfit += profit
      }
    }
    console.debug('🚀 ~ realizedProfit:', realizedProfit)

    return {
      txs: tempDataRaw,
      roi: realizedProfit,
    }
  } catch (e) {
    console.error(e)
    return null
  }
}
