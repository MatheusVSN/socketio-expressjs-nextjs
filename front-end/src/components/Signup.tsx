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
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { fetchWrapper } from "@/lib/fetch"
import { AuthenticationResponse } from "@/types"
import { useToast } from "./ui/use-toast"

const username = z.string().min(3, {
  message: "Username must be at least 3 characters long",
})

const email = z
  .string({
    required_error: "Email is required",
  })
  .email({
    message: "You must insert a proper email",
  })

const password = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  })

const SignUpSchema = z.object({
  email,
  username,
  password,
})

export default function SignupComponent() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      password: {
        password: "",
        confirmPassword: "",
      },
    },
  })

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsLoading(() => true)
    console.log(data)
    const signUpResponse = await fetchWrapper<AuthenticationResponse>(
      "/api/signup",
      {
        method: "POST",
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password.password,
        }),
      }
    )

    if (signUpResponse.status !== 201) {
      const errorMessage = signUpResponse.result.message as string
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
        <CardTitle>Sign up</CardTitle>
        <CardDescription>
          Create your account to get acess to the chat
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormDescription>Your account email</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="password.password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormDescription>Your account password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password.confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormDescription>Confirm your password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
