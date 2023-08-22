import { Skeleton } from "./ui/skeleton"

export default function MessagesLoadingSkeleton() {
  const fakeArray = new Array(14).fill(null)

  return (
    <div className="p-4 flex flex-col gap-4">
      {fakeArray.map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          <Skeleton className="w-10 h-10 rounded-full self-start" />
          <Skeleton className="self-start h-20 w-full rounded-md" />
        </div>
      ))}
    </div>
  )
}
