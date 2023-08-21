import { z } from "zod"
import { NextResponse, NextRequest } from "next/server"
import { serverFetchWrapper } from "../../../lib/fetch"
import { AuthenticationResponse } from "../../../types"

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


export const POST = async (request: NextRequest) => {
    try {
        const requestBody = await request.json()
        await loginSchema.parseAsync(requestBody)

        const { username, password } = requestBody

        const backendResponse = await serverFetchWrapper<AuthenticationResponse>(`/authentication/login`, {
            method: "POST",
            body: JSON.stringify({
                username,
                password
            })
        })

        if (backendResponse.status !== 200) {
            if ("message" in backendResponse.result) {
                throw new Error(backendResponse.result.message as string)
            } else {
                throw new Error("An unknown error happened. Please try again later")
            }

            return
        }

        const { acessToken, refreshToken } = backendResponse.result as AuthenticationResponse

        const response = NextResponse.json({ message: "Succes" }, { status: 200 })

        response.cookies.set({
            name: "acessToken",
            value: acessToken
        })
        response.cookies.set({
            name: "refreshToken",
            value: refreshToken
        })

        return response
    } catch (exception: any) {
        if (exception instanceof z.ZodError) {
            const result = exception.errors[0]
            return NextResponse.json({ result }, { status: 400 })
        }

        return NextResponse.json({ message: exception.message }, { status: 400 })
    }
}