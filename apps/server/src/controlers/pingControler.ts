import { Request, Response } from 'express'

export const ping = async (_req: Request, res: Response): Promise<void> => {
  res.status(201).json(true)
}
