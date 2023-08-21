"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { fetchWrapper } from "@/lib/fetch"
import { AuthenticationResponse } from "@/types"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const username = z.string().min(3, {
  message: "Username must be at least 3 characters long",
})

const password = z.string().min(8, {
  message: "Password must be at least 8 characters long",
})

const loginSchema = z.object({
  username,
  password,
})

export default function LoginComponent() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()
  const { getUserInformation } = useCurrentUser()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(() => true)
    const loginResponse = await fetchWrapper<AuthenticationResponse>(
      "/api/login",
      {
        method: "POST",
        body: JSON.stringify({ ...data }),
      }
    )

    if (loginResponse.status !== 200) {
      const errorMessage = loginResponse.result.message as string
      toast({
        title: "Something went wrong on the login",
        description:
          errorMessage && errorMessage != ""
            ? errorMessage
            : "An unknown error happened. Please try again later",
        variant: "destructive",
      })

      setIsLoading(() => false)
      return
    }

    window.location.reload()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>
          Acess your account to get acess to the chat
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="your user" {...field} />
                  </FormControl>
                  <FormDescription>Your account username</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="*******" type="password" {...field} />
                  </FormControl>
                  <FormDescription>Your account password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
