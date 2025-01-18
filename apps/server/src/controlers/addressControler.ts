import { Request, Response } from 'express'

import Address, { IAddress } from '../modals/Address'

import { validateSignature } from '../utils/web3'

export const saveAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { address, sig, hubName } = req.body

    if (!address || !sig || !hubName) {
      res.status(400).json({ message: 'Invalid address or signature' })
      return
    }

    // verify the signature
    const isValidSignature = validateSignature(hubName, sig, address)

    if (!isValidSignature) {
      res.status(400).json({ message: 'Invalid signature' })
      return
    }

    const addressExisted = await Address.findOne({ sig })

    if (!addressExisted) {
      const newAddress: IAddress = new Address({
        address,
        sig,
      })

      await newAddress.save()
    }

    res.status(201).json(true)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error saving the message' })
  }
}
