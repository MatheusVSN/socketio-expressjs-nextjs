import { User } from "@prisma/client"
import { config } from "dotenv"
import jwt from "jsonwebtoken"
config()

const JWT_ACESS_SECRET = process.env.JWT_ACESS_SECRET as string
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

export const generateAcessToken = (user: User) => {
    return jwt.sign({ userId: user.id }, JWT_ACESS_SECRET, {
        expiresIn: "1d"
    })
}

export const generateRefreshToken = (user: User, jti: string) => {
    return jwt.sign({
        userId: user.id,
        jti
    }, JWT_REFRESH_SECRET, {
        expiresIn: "7d"
    })
}

export const generateTokens = (user: User, jti: string) => {
    const acessToken = generateAcessToken(user)
    const refreshToken = generateRefreshToken(user, jti)

    return {
        acessToken, refreshToken
    }
}