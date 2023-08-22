"use client"

import { Message, MessagesListResponse } from "@/types"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import MessageContentComponent from "./MessageContentComponent"

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string

interface MessageComponentProps {
  acessToken: string
  messagesList: MessagesListResponse
}

export default function MessagesComponent({
  acessToken,
  messagesList,
}: MessageComponentProps) {
  const [currentMessages, setCurrentMessages] = useState(messagesList)

  useEffect(() => {
    // ws://localhost:3333
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        authorization: acessToken,
      },
    })

    socket.on("message created", (newMessage: Message) => {
      setCurrentMessages((previousMessages) => {
        return [...previousMessages, newMessage]
      })
    })

    return () => {
      socket.disconnect()
    }
  })

  return (
    <div className="p-4 flex flex-col gap-4">
      {currentMessages.map((message) => (
        <MessageContentComponent key={message.id} messageObject={message} />
      ))}
    </div>
  )
}
