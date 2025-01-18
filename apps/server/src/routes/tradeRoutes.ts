import express from 'express'

import { getTrade, getTrades } from '../controlers/tradeControler'

const router = express.Router()

router.get('/trade', getTrade)
router.get('/trades', getTrades)

export default router
