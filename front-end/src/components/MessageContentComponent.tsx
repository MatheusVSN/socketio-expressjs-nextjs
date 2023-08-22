import { Message } from "@/types"
import { Avatar, AvatarFallback } from "./ui/avatar"

//   id: '9c6e2a7c-b2a8-4645-a909-99542f786039',
//   userId: 'c5407d7b-50d8-44c8-baba-06c30a0d2ef5',
//   message: 'AYO?',
//   createdAt: '2023-08-22T13:42:27.481Z',
//   updatedAt: '2023-08-22T13:42:27.481Z',
//   user: { id: 'c5407d7b-50d8-44c8-baba-06c30a0d2ef5', username: 'mat' }

interface MessageContentComponentProps {
  messageObject: Message
}

export default function MessageContentComponent({
  messageObject,
}: MessageContentComponentProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="self-start">
        <AvatarFallback>{messageObject.user.username.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="grid self-start border p-4 rounded-md w-full bg-card">
        <h4 className="text-md font-semibold tracking-tight">
          {messageObject.user.username}
        </h4>
        <p className="leading-7 text-sm">{messageObject.message}</p>
      </div>
    </div>
  )
}
