import MessageInputComponent from "@/components/MessageInput"
import MessageList from "@/components/MessageList"
import { Suspense } from "react"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string

export default async function ChatPage() {
  return (
    <div className="flex h-full">
      <main className="flex-1 h-full flex">
        <Suspense fallback={<p>Loading ...</p>}>
          <MessageList />
        </Suspense>
        <div className="fixed bottom-0 w-full p-4 border-t">
          <MessageInputComponent />
        </div>
      </main>
    </div>
  )
}
