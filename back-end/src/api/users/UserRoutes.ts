import { NextFunction, Response, Router, Request } from "express";
import { isAuthenticated } from "../../middleware";
import { findUserById } from "./UserService";
import { profileToDTO } from "../../utils/modelToDTO";
import { User } from "@prisma/client";
import { z } from "zod"

const router = Router()

const message = z.string()

const messageBodySchema = z.object({
    body: z.object({
        message
    })
})

router.get("/profile", isAuthenticated, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.payload.userId
        const user = await findUserById(userId)

        const profileDTO = profileToDTO(user as User)
        return response.json(profileDTO)
    } catch (exception: any) {
        return response.status(500).json({ message: exception.message })
    }
})

export default router