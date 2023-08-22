import { serverFetchWrapper } from "@/lib/fetch"
import { MessagesListResponse } from "@/types"
import { cookies } from "next/headers"
import MessagesComponent from "./MessagesComponent"

const getCookie = async (name: string) => {
  return cookies().get(name)?.value ?? ""
}

const getAllMessages = async () => {
  const messageList = await serverFetchWrapper<MessagesListResponse>(
    "/chat/messages",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    },
  )

  // TODO: Error handling?

  return messageList.result
}

export default async function MessageList() {
  const acessToken = await getCookie("acessToken")
  const messagesList = await getAllMessages()

  return <MessagesComponent acessToken={acessToken} messagesList={messagesList} />
}
