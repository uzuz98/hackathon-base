import cors from 'cors'
import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import { Socket, Server as socketIo } from 'socket.io'

import addressRoutes from './routes/addressRoutes'
import swapRoutes from './routes/swapRoutes'

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
    'mongodb+srv://tsocial627:snTFPuTjwiFvQKQf@cluster0.rtao3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
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

// Set up Socket.IO connection
io.on('connection', (socket: Socket) => {
  console.log('a user connected')
  socket.on('send_message', (msg: string) => {
    socket.broadcast.emit('recieve_message', msg)
  })
})

// Serve the homepage route
app.get('/ping', (req, res) => {
  res.send('Hello, World!')
})

// Start the server
const port = process.env.PORT || 3001
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
