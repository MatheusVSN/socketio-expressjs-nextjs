"use client"

import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { ChangeEvent, useState } from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "./ui/use-toast"
import { fetchWrapper } from "@/lib/fetch"

const MessageSchema = z.object({
  content: z.string().min(1, "You must insert a content for your message"),
})

export default function MessageInputComponent() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  })
  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(() => true)

    const messageResponse = await fetchWrapper<any>("/api/message", {
      method: "POST",
      body: JSON.stringify({
        message: data.content,
      }),
    })

    if (messageResponse.status !== 201) {
      console.log(messageResponse.result)
      const errorMessage = messageResponse.result.message as string
      toast({
        title: "Something went wrong on the login",
        description:
          errorMessage && errorMessage != ""
            ? errorMessage
            : "An unknown error happened. Please try again later",
        variant: "destructive",
      })
    }
    setIsLoading(() => false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What you're thinking today?"
                  className="resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // Disable enter break line
                      e.preventDefault()
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Submit message
        </Button>
      </form>
    </Form>
  )
}
