import express from 'express'
import { saveAddress } from '../controlers/addressControler'

const router = express.Router()

router.post('/address', saveAddress)

export default router
