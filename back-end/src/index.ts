import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { config } from "dotenv";
import authRoute from "./api/auth/AuthRoutes";
import userRoute from "./api/users/UserRoutes"
import chatRoute from "./api/chat/ChatRoutes"
import bodyParser from "body-parser"
import { Server } from "socket.io";
import console from "console";
import { configureSocket } from "./utils/socketConfiguration";

config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use("/authentication", authRoute)
app.use("/user", userRoute)
app.use("/chat", chatRoute)

const server = app.listen(3333, () => {
    console.log("Server started on port 3333")
})

const io = new Server(server)
configureSocket(io)