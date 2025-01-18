import express from 'express'

import { getTrades } from '../controlers/tradeControler'

const router = express.Router()

router.get('/trades', getTrades)

export default router
