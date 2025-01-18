import express from 'express'

import { getTrade, getTrades, getTradeWithAddress } from '../controlers/tradeControler'

const router = express.Router()

router.post('/trade', getTrade)
router.get('/trades', getTrades)
router.get('/trade-with-address', getTradeWithAddress)

export default router
