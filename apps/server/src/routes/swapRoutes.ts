import express from 'express'
import { getDataToSwap } from '../controlers/swapController'

const router = express.Router()

router.post('/swap', getDataToSwap)

export default router
