import { Request, Response } from 'express'


import { getData } from '../utils/rawTx'

export const getTrades = async (req: Request, res: Response): Promise<void> => {
  try {
    const { time } = req.body

    if (typeof time !== 'number' || !time) {
      res.status(400).json({ message: 'Bad request' })
      return
    }

    // verify the signature
    const data = getData(time)

    if (!data) {
      res.status(400).json({ message: 'Invalid data' })
      return
    }

    res.status(201).json(JSON.stringify(data))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error saving the message' })
  }
}
