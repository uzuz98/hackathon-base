import cors from 'cors'
import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import { Socket, Server as socketIo } from 'socket.io'

import { KYBER_ABI } from './abi/KYBER_ABI'
import { decodeInput } from './utils/rawTx'
import subscribe from './utils/subscribe'

import addressRoutes from './routes/addressRoutes'
import swapRoutes from './routes/swapRoutes'
import tradeRoutes from './routes/tradeRoutes'

const corsOptions = {
  origin: '*',
}

// Create express app
const app = express()
const server = http.createServer(app)
const io = new socketIo(server, {
  cors: {
    origin: '*',
  },
})

// MongoDB connection
mongoose
  .connect(
    'mongodb+srv://tsocial627:_yaPt82gr5-i4Q8@tbeo.6pbqx0h.mongodb.net/myVirtualDatabase?retryWrites=true&w=majority&appName=tbeo',
    {},
  )
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
  })

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(addressRoutes)
app.use(swapRoutes)
app.use(tradeRoutes)

// Set up Socket.IO connection
io.on('connection', (socket: Socket) => {
  console.log('a user connected')
  subscribe(socket)
})

// Serve the homepage route
app.get('/ping', (req, res) => {
  // decodeInput(KYBER_ABI, '')
  res.send('Hello, World!')
})

// Start the server
const port = process.env.PORT || 3001
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
