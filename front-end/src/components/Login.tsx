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
  const { toast } = useToast()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const loginResponse = await fetchWrapper<AuthenticationResponse>(
      "/authentication/login",
      {
        method: "POST",
        body: JSON.stringify({ ...data }),
      }
    )

    if (loginResponse.status !== 200) {
      if ("message" in loginResponse.result) {
        toast({
          title: "Something went wrong on the login",
          description: loginResponse.result.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Something went wrong on the login",
          description: "An unknown error happened. Please try again later",
          variant: "destructive",
        })
      }
      return
    }

    console.log(loginResponse)
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
                    <Input placeholder="*******" {...field} />
                  </FormControl>
                  <FormDescription>Your account password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
