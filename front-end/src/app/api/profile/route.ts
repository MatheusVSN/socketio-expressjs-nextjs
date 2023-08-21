import { serverFetchWrapper } from "@/lib/fetch";
import { AuthenticationResponse, Profile } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    const acessToken = request.cookies.get("acessToken")?.value
    const refreshToken = request.cookies.get("refreshToken")?.value

    if (!acessToken) return NextResponse.json({ message: "Unauthorized" }, { status: 404 })

    const backendResponse = await serverFetchWrapper<Profile>("/user/profile", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${acessToken}`
        }
    })

    if (backendResponse.status !== 200) {
        if (refreshToken) {
            const refreshTokenResponse = await serverFetchWrapper<AuthenticationResponse>("/authentication/refreshToken", {
                method: "POST",
                body: JSON.stringify({
                    refreshToken
                })
            })

            if (refreshTokenResponse.status !== 200) {
                return false
            }

            request.cookies.set("acessToken", refreshTokenResponse.result.acessToken)
            request.cookies.set("refreshToken", refreshTokenResponse.result.refreshToken)
        }
        return NextResponse.json({ message: "Unauthorized" }, { status: 404 })
    }

    return NextResponse.json({
        data: backendResponse.result
    }, { status: 200 })
}