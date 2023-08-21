import { NextFunction, Request, Response, Router, request, response } from "express";
import { createNewMessage, getAllMessages } from "./ChatService";
import { isAuthenticated } from "../../middleware";
import { z } from "zod"
import console from "console";
import { getSocketInstance } from "../../utils/socketConfiguration";

const router = Router()

const message = z.string({
    required_error: "You must insert a message"
})

const messageBodySchema = z.object({
    body: z.object({
        message
    })
})

router.get("/messages", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const allMessages = await getAllMessages()
        return response.json(allMessages)
    } catch (exception: any) {
        return response.status(500).json({ message: exception.message })
    }
})

router.post("/message", isAuthenticated, async (request: Request, response: Response, next: NextFunction) => {
    try {
        await messageBodySchema.parseAsync(request)
        const { message } = request.body
        const user = request.payload.userId

        const createdMessage = await createNewMessage(user, message)
        const ioInstance = getSocketInstance()

        ioInstance?.emit("message", createdMessage)
        return response.json(createdMessage)
    } catch (exception: any) {
        if (exception instanceof z.ZodError) {
            const firstError = exception.errors[0]
            return response.status(400).json(firstError)
        }
        return response.status(500).json({ message: exception.message })
    }
})

export default router