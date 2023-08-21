import { Message, User } from "@prisma/client"
import database from "../../utils/db"
import { userModelToDTO } from "../../utils/modelToDTO"
import { findUserById } from "../users/UserService"

interface MessageModel extends Message {
    user: User
}

export const messageModelTODTO = (message: MessageModel) => {
    const userDTO = userModelToDTO(message.user)
    return { ...message, user: userDTO }
}

export const getAllMessages = async () => {
    const allMessages = await database.message.findMany({
        include: {
            user: true
        },
        orderBy: {
            createdAt: "desc"
        },
    })

    const finalMessageList = allMessages.map((message) => messageModelTODTO(message))

    console.log("final", finalMessageList)
    return finalMessageList
}

export const createNewMessage = async (userId: string, message: string) => {
    const createdMessage = await database.message.create({
        data: {
            message,
            userId
        },
        include: {
            user: true
        }
    })

    const messageDTO = messageModelTODTO(createdMessage)
    return messageDTO
}