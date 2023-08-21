"use client"

import { MessagesListResponse } from "@/types"

interface MessageComponentProps {
  acessToken: string
  messagesList: MessagesListResponse
}

export default function MessagesComponent({
  acessToken,
  messagesList,
}: MessageComponentProps) {
  return <h1>Messages Component Loaded!</h1>
}
