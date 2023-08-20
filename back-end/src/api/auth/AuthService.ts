import { User } from "@prisma/client";
import database from "../../utils/db";
import { hashToken } from "../../utils/hashToken";

interface RefreshToWhiteListParameters {
    jti: string,
    refreshToken: string,
    userId: string
}

export const addRefreshTokenToWhitelist = ({ jti, refreshToken, userId }: RefreshToWhiteListParameters) => {
    return database.refreshToken.create({
        data: {
            id: jti,
            hashedToken: hashToken(refreshToken),
            userId
        }
    })
}

export const findRefreshTokenById = (id: string) => {
    return database.refreshToken.findUnique({
        where: { id }
    })
}

export const deleteRefreshToken = (id: string) => {
    return database.refreshToken.update({
        where: { id },
        data: { revoked: true }
    })
}

export const revokeTokens = (userId: string) => {
    return database.refreshToken.updateMany({
        where: { userId },
        data: { revoked: true }
    })
}