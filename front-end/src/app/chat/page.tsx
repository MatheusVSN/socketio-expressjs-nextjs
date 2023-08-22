import MessageInputComponent from "@/components/MessageInput"
import MessageList from "@/components/MessageList"
import MessagesLoadingSkeleton from "@/components/MessagesSkeleton"
import { Suspense } from "react"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string

export default async function ChatPage() {
  return (
    <main className="flex-1 h-full flex flex-col">
      <Suspense fallback={<MessagesLoadingSkeleton />}>
        <MessageList />
      </Suspense>
      <div className="sticky bottom-0 w-full p-4 border-t bg-background">
        <MessageInputComponent />
      </div>
    </main>
  )
}
