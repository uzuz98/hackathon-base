import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_SERVER_URL = 'http://localhost:3001' // Update this to match your server URL

export default function useSocket(): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketClient = io(SOCKET_SERVER_URL)

    socketClient.on('connect', () => {
      console.log('Connected to Socket.IO server')
    })

    socketClient.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server')
    })

    setSocket(socketClient)

    return () => {
      socketClient.disconnect()
    }
  }, [])

  return socket
}
