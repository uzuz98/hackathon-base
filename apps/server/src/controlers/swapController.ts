import { Request, Response } from 'express'
import axios from 'axios'
import { AggregatorDomain, ChainName, MORALIS_API_KEY } from '../utils/constants'


type IGetSwapRouteV1Params = {
  tokenIn: {
    address: string
    decimals: number
  }
  tokenOut: {
    address: string
    decimals: number
  }
  amountIn: number
}

const getBaseTokenInfo = async (tokenInAddress: string, tokenOutAddress:string) => {

    try {
        const options = {
            method: 'GET',
            url: 'https://deep-index.moralis.io/api/v2.2/erc20/metadata',
            params: { 
                chain: 'base',
                'addresses[0]': tokenInAddress,
                'addresses[1]': tokenOutAddress
             },
            headers: {
                accept: 'application/json',
                'X-API-Key': MORALIS_API_KEY
            }
            };
            const data = await axios.request(options)
            const tokenInMetaData = data.data.find((item:any)=>item.address === tokenInAddress)
            const tokenOutMetaData = data.data.find((item:any)=>item.address === tokenOutAddress)
            return {
                tokenInMetaData: tokenInMetaData,
                tokenOutMetaData: tokenOutMetaData
            }
    } catch (error) {
        return {
            tokenInMetaData: null,
            tokenOutMetaData: null
        }
    }
}
export async function getSwapRouteV1({ tokenIn, tokenOut, amountIn }: IGetSwapRouteV1Params) {
  const targetChain = ChainName.BASE
  const targetPath = `/${targetChain}/api/v1/routes`
  const targetPathConfig = {
    params: {
      tokenIn: tokenIn.address,
      tokenOut: tokenOut.address,
      amountIn: Number(amountIn * 10 ** tokenIn.decimals).toString(),
    },
  }
  try {
    const { data } = await axios.get(AggregatorDomain + targetPath, targetPathConfig)

    console.log('[V1] GET Response:')
    console.log(data)
    return data.data
  } catch (error) {
    console.log(error)
  }
}

interface IGetDataToSwapV1Params extends IGetSwapRouteV1Params {
  senderAddress: string
}

export async function getDataToSwapV1({ senderAddress, ...swapRoute }: IGetDataToSwapV1Params) {
  // Get the path to be called
  const targetChain = ChainName.BASE
  const targetPath = `/${targetChain}/api/v1/route/build`

  // Get the route summary data to be encoded
  const swapRouteData = await getSwapRouteV1(swapRoute)
  const routeSummary = swapRouteData.routeSummary

  // Configure the request body (refer to Docs for the full list)
  const requestBody = {
    routeSummary: routeSummary,
    sender: senderAddress,
    recipient: senderAddress,
    slippageTolerance: 10, //0.1%
  }

  // Call the API with axios to handle async calls
  try {
    console.log('\nCalling [V1] Post Swap Route For Encoded Data...')
    const { data } = await axios.post(AggregatorDomain + targetPath, requestBody)

    return data.data
  } catch (error) {
    console.log(error)
  }
}

export const getDataToSwap = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenIn, tokenOut, senderAddress, amountIn } = req.body

    if (!tokenIn || !tokenOut || !senderAddress || !amountIn) {
      res.status(400).json({ message: 'Must fill all values' })
      return
    }
    const dataToSwap = await getDataToSwapV1({
      tokenIn,
      tokenOut,
      senderAddress,
      amountIn,
    } as IGetDataToSwapV1Params)
    const {tokenInMetaData, tokenOutMetaData} = await getBaseTokenInfo(tokenIn.address, tokenOut.address)
    const responseData = {
        tokenIn: tokenInMetaData,
        tokenOut: tokenOutMetaData,
        dataToSwap: dataToSwap
    }
    res.status(201).json(responseData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error saving the message' })
  }
}
