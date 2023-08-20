import { User } from "@prisma/client"

type UserDTO = {
    id: string,
    username: string
}

type ProfileDTO = {
    id: string
    username: string
    email: string
}

const filter = <TObject extends Record<string, any>>(object: TObject, propertiesToKeep: Array<keyof TObject>): Partial<TObject> => {
    const filteredObject = new Map<keyof TObject, any>()

    Object.keys(object).forEach(property => {
        if (propertiesToKeep.includes(property)) {
            filteredObject.set(property, object[property])
        }
    })

    return Object.fromEntries(filteredObject) as Partial<TObject>
}

export const userModelToDTO = (user: User) => {
    const toMaintain: (keyof User)[] = ["id", "username"]

    return filter(user, toMaintain) as UserDTO
}

export const profileToDTO = (user: User) => {
    const toMaintain: (keyof User)[] = ["id", "username", "email"]

    return filter(user, toMaintain) as ProfileDTO
}