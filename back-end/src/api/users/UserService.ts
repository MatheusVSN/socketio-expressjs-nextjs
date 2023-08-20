import { User } from "@prisma/client"
import database from "../../utils/db"
import bcrypt from "bcrypt"

interface UserCredential {
    email: string
    password: string
    username: string
}

export const findUserByEmail = (email: string) => {
    return database.user.findUnique({
        where: {
            email
        }
    })
}

export const findUserByUsername = (username: string) => {
    return database.user.findUnique({
        where: {
            username
        }
    })
}

export const createUser = (user: UserCredential) => {
    user.password = bcrypt.hashSync(user.password, 12)
    return database.user.create({
        data: user
    })
}

export const findUserById = (id: string) => {
    return database.user.findUnique({
        where: {
            id
        }
    })
}