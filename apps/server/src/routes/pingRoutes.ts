import express from 'express'
import { ping } from '../controlers/pingControler'

const router = express.Router()

router.get('/ping', ping)

export default router
