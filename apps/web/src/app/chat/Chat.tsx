'use client'

import { useEffect, useState } from 'react'
import useSocket from '../../hooks/useSocket'
import BaseAPI from '../../libs/axios'

type Message = {
  sender: string
  text: string
}

export default function Chat() {
  const socket = useSocket()
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit('send_message', message)
      setMessages((prev) => [...prev, { sender: 'You', text: message }])
      setMessage('')
    }
  }

  useEffect(() => {
    ;(async () => {
      const res = await BaseAPI({ method: 'get', url: '/trades' })
      console.debug('🚀 ~ file: Chat.tsx:28 ~ res:', res)
    })()
  }, [])

  useEffect(() => {
    if (!socket) return

    const handleIncomingMessage = (data: string) => {
      setMessages((prev) => [...prev, { sender: 'Other', text: data }])
    }

    const handleIncomingNewBlock = (data: any) => {
      console.debug('🚀 ~ file: Chat.tsx:40 ~ data:', data)
    }

    socket.on('recieve_message', handleIncomingMessage)
    socket.on('newBlock', handleIncomingNewBlock)

    return () => {
      socket.off('message', handleIncomingMessage)
    }
  }, [socket])

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message" />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}
