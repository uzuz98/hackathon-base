import { Request, Response } from 'express'

import TxsData, { ITxsData } from '../modals/TxsData'
import { getData, getDataFromRawData, TIME_FRAME } from '../utils/rawTx'

export const getTrade = async (req: Request, res: Response): Promise<void> => {
  try {
    // method get
    const { transaction } = req.query

    // verify the signature
    const data = getDataFromRawData(transaction)

    if (!data) {
      res.status(400).json({ message: 'Invalid data' })
      return
    }

    res.status(201).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error saving the message' })
  }
}

export const getTradeWithAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    // method get
    const { address } = req.query

    if (typeof address !== 'string' || !address) {
      res.status(400).json({ message: 'Bad request' })
      return
    }

    // verify the signature
    const data = await getData(address, TIME_FRAME.THREE_DAYS)

    if (!data) {
      res.status(400).json({ message: 'Invalid data' })
      return
    }

    res.status(201).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error saving the message' })
  }
}

export const getTrades = async (req: Request, res: Response): Promise<void> => {
  // method get
  const { time } = req.query

  const timeReq = Object.values(TIME_FRAME).includes(time as unknown as TIME_FRAME) ? time : TIME_FRAME.THREE_DAYS

  const findOne = await TxsData.findOne({ address: '0xcac2edcd082628ba3ba31b3b74537792550319e6' })

  if (findOne) {
    const txsData = await TxsData.find({
      address: {
        $in: [
          '0xcac2edcd082628ba3ba31b3b74537792550319e6',
          '0x1B11BFd98Fe17B4689069E7739a32F26167976F1',
          '0x120708dA3C72cC92EbAC86FB0d1259394106a4D7',
          '0xf21ae414c02E02321258A31fa41CFf6A7DC1C36F',
          '0x166Fb0D9FF835A300B2Fa86A9Ba2F545dd4C0f80',
          '0x6cBccf95C236E8837d86eB2b81c88Bc1853DCc4F',
          '0xafAa316A3335D1A642203853B458B4A98d537ae2',
          '0x14DF96EbA4fc8541E4A95e7E333e5eb32608f189',
          '0xB2713e1BB37a0Fc74777117B3863C905A30edE0A',
          '0x0cad44312eb59d2f407b0c07c1d90817fcd22403',
        ],
      },
    })
    res.status(201).json(txsData)
  } else {
    const data = await Promise.all(
      [
        '0xcac2edcd082628ba3ba31b3b74537792550319e6',
        '0x1B11BFd98Fe17B4689069E7739a32F26167976F1',
        '0x120708dA3C72cC92EbAC86FB0d1259394106a4D7',
        '0xf21ae414c02E02321258A31fa41CFf6A7DC1C36F',
        '0x166Fb0D9FF835A300B2Fa86A9Ba2F545dd4C0f80',
        '0x6cBccf95C236E8837d86eB2b81c88Bc1853DCc4F',
        '0xafAa316A3335D1A642203853B458B4A98d537ae2',
        '0x14DF96EbA4fc8541E4A95e7E333e5eb32608f189',
        '0xB2713e1BB37a0Fc74777117B3863C905A30edE0A',
        '0x0cad44312eb59d2f407b0c07c1d90817fcd22403',
      ].map(async (address) => {
        const data = await getData(address, timeReq as TIME_FRAME)
        console.log('🚀 ~ file: tradeControler.ts:66 ~ data:', data)

        const newTxs: ITxsData = new TxsData({
          address,
          txs: data?.txs || [],
          roi: data?.roi || 0,
        })

        await newTxs.save()

        return data
      }),
    )

    if (!data) {
      res.status(201).json(null)
    } else {
      res.status(201).json(data)
    }
  }
}
