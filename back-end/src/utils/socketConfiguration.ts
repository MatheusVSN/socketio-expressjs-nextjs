import { Server, Socket } from "socket.io";

let ioInstance: Server | null = null

export const configureSocket = (io: Server) => {
    if (ioInstance) return
    ioInstance = io

    io.on("connection", (socket: Socket) => {
        console.log("made socket connection")

        socket.on("hi", () => {
            console.log("yo")
        })
    })
}

export const getSocketInstance = () => {
    return ioInstance
}