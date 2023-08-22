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
    const socket = io("ws://localhost:3333", {
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
