import { NextFunction, Router, Request, Response, request, response } from "express"
import { v4 as uuidv4 } from "uuid"
import { generateTokens } from "../../utils/jwt"
import { addRefreshTokenToWhitelist, deleteRefreshToken, findRefreshTokenById, revokeTokens } from "./AuthService"
import { createUser, findUserByEmail, findUserById, findUserByUsername } from "../users/UserService"
import { z } from "zod"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { hashToken } from "../../utils/hashToken"

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

const router = Router()

const email = z.string({
    required_error: "Email is required"
}).email()
const password = z.string({
    required_error: "Password is required"
}).min(8, "Your password must be at least 8 characters long")
const username = z.string({
    required_error: "Username is required"
}).min(3, "Your username must be atleast 3 characters long")

const authenticationBodySchema = z.object({
    body: z.object({
        email,
        password,
        username
    })
})

const loginBodySchema = z.object({
    body: z.object({
        username,
        password
    })
})

router.post("/register", async (request: Request, response: Response, next: NextFunction) => {
    try {
        await authenticationBodySchema.parseAsync(request)
        const { email, password, username } = request.body

        const existingUserByEmail = await findUserByEmail(email)
        const existingUserByUsername = await findUserByUsername(username)

        if (existingUserByEmail) throw new Error("Email already in use")
        if (existingUserByUsername) throw new Error("Username is already being used")

        const createdUser = await createUser({
            email, password, username
        })
        const jti = uuidv4()
        const { acessToken, refreshToken } = generateTokens(createdUser, jti)
        await addRefreshTokenToWhitelist({ jti, refreshToken, userId: createdUser.id })

        return response.json({
            acessToken,
            refreshToken
        })
    } catch (exception: any) {
        response.status(400)

        if (exception instanceof z.ZodError) {
            const firstError = exception.errors[0]
            return response.json(firstError)
        }

        return response.json({ message: exception.message })
    }
})

router.post("/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
        await loginBodySchema.parseAsync(request)
        const { username, password } = request.body

        const existingUser = await findUserByUsername(username)

        if (!existingUser) {
            response.status(403)
            throw new Error("Invalid login credentials")
        }

        const validPassword = await bcrypt.compare(password, existingUser.password)
        if (!validPassword) {
            response.status(403)
            throw new Error("Invalid login credentials")
        }

        const jti = uuidv4()
        const { acessToken, refreshToken } = generateTokens(existingUser, jti)
        await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id })

        return response.json({
            acessToken,
            refreshToken
        })
    } catch (exception: any) {
        if (exception instanceof z.ZodError) {
            const firstError = exception.errors[0]
            response.status(400)
            return response.json(firstError)
        }

        return response.json({ message: exception.message })
    }
})

router.post("/refreshToken", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { refreshToken } = request.body

        if (!refreshToken) {
            response.status(400)
            throw new Error("Missing refresh refresh token")
        }

        const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload
        const savedRefreshToken = await findRefreshTokenById(payload.jti as string)

        if (!savedRefreshToken || savedRefreshToken.revoked) {
            response.status(401)
            throw new Error("Unauthorized")
        }

        const hashedToken = hashToken(refreshToken)
        if (hashedToken !== savedRefreshToken.hashedToken) {
            response.status(401)
            throw new Error("Unauthorized")
        }

        const user = await findUserById(payload.userId)
        if (!user) {
            response.status(401)
            throw new Error("Unauthorized")
        }

        await deleteRefreshToken(savedRefreshToken.id)
        const jti = uuidv4()
        const { acessToken, refreshToken: newRefreshToken } = generateTokens(user, jti)

        return response.json({
            acessToken,
            refreshToken: newRefreshToken
        })
    } catch (exception: any) {
        return response.json({ message: exception.message })
    }
})

// This endpoint is only for demo purpose.
// Move this logic where you need to revoke the tokens( for ex, on password reset)
router.post("/revokeRefreshTokens", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { userId } = request.body
        await revokeTokens(userId)
        return response.json({
            message: `Tokens revoked for user with id ${userId}`
        })
    } catch (exception: any) {
        return response.json({ message: exception.message })
    }
})

export default router