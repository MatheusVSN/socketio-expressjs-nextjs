import { serverFetchWrapper } from "@/lib/fetch";
import { Message } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const MessageSchema = z.object({
    message: z.string().min(1, "You must insert your message content")
})

export const POST = async (request: NextRequest) => {
    try {
        const acessToken = request.cookies.get("acessToken")?.value

        const requestBody = await request.json()
        await MessageSchema.parseAsync(requestBody)

        const { message } = requestBody
        const backendResponse = await serverFetchWrapper<Message>(`/chat/message`, {
            method: "POST",
            body: JSON.stringify({
                message
            }),
            headers: {
                "Authorization": `Bearer ${acessToken}`,
                "Content-Type": "application/json"
            }
        })

        if (backendResponse.status !== 200) {
            if ("message" in backendResponse.result) {
                throw new Error(backendResponse.result.message as string)
            } else {
                throw new Error("An unknown error happened. Please try again later")
            }
        }

        return NextResponse.json({ message: "Created!" }, { status: 201 })
    } catch (exception: any) {
        if (exception instanceof z.ZodError) {
            const result = exception.errors[0]
            return NextResponse.json(result, { status: 400 })
        }

        return NextResponse.json({ message: exception.message }, { status: 400 })
    }
}