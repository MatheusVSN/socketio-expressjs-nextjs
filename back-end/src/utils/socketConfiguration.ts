import { NextFunction } from "express";
import { Server, Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import jwt from "jsonwebtoken"
import { config } from "dotenv";
config()

const JWT_ACESS_TOKEN = process.env.JWT_ACESS_SECRET as string

let ioInstance: Server | null = null

export const configureSocket = (io: Server) => {
    if (ioInstance) return
    ioInstance = io

    io.on("connection", (socket: Socket) => {
        console.log("made socket connection")
    })

    io.use((socket, next) => {
        // For some reason postman doesn't have the auth object, so I'll use from headers if i'm doing a connection from postman
        const authorization = socket.handshake.auth.authorization || socket.handshake.headers.authorization
        if (!authorization) next(new Error("Unauthorized"))

        try {
            jwt.verify(authorization as string, JWT_ACESS_TOKEN)
        } catch (exception: any) {
            next(new Error("Authentication error"))
        }

        next()
    })
}

export const getSocketInstance = () => {
    return ioInstance
}