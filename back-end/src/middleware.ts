import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
config()

const JWT_ACESS_TOKEN = process.env.JWT_ACESS_SECRET as string

export const isAuthenticated = (request: Request, response: Response, next: NextFunction) => {
    const { authorization } = request.headers

    if (!authorization) {
        response.status(401)
        throw new Error("Unauthorized")
    }

    try {
        const token = authorization.split(" ")[1]
        const payload = jwt.verify(token, JWT_ACESS_TOKEN)

        request.payload = payload
    } catch (exception: any) {
        response.status(401)
        if (exception.name === "TokenExpiredError") {
            return response.json({ message: "Access expired" })
        }

        return response.json({ message: "Unauthorized" })
    }

    return next()
}
