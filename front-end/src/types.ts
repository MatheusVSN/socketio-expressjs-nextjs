export interface AuthenticationResponse {
    message: string
    acessToken: string
    refreshToken: string
}

export interface Message {
    id: string
    userId: string
    message: string
    createdAt: string
    updatedAt: String
    user: User
}

export type MessagesListResponse = Message[]

export interface User {
    id: string
    username: string
}

export interface Profile extends User {
    email: string
}