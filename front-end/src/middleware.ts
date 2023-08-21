import { NextRequest, NextResponse } from "next/server";
import { serverFetchWrapper } from "./lib/fetch";
import { AuthenticationResponse } from "./types";

const PROTECTED_PAGES = ["/chat"]
const AUTH_PAGES = ["/"]

const isProtectedRoute = (url: string) => PROTECTED_PAGES.some((page) => url.startsWith(page))
const isAuthRoute = (url: string) => AUTH_PAGES.some((page) => url.startsWith(page))

const validateToken = async (request: NextRequest) => {
    const acessToken = request.cookies.get("acessToken")
    const refreshToken = request.cookies.get("refreshToken")

    const userResponse = await serverFetchWrapper("/user/profile", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${acessToken}`
        }
    })

    if (userResponse.status !== 200) {
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

    return true
}

export const middleware = async (request: NextRequest) => {
    const { cookies, nextUrl, url } = request

    const acessToken = cookies.get("acessToken")?.value
    const refreshToken = cookies.get("refreshToken")?.value

    const requireAuthPage = isProtectedRoute(nextUrl.pathname)
    const isAuthPage = isAuthRoute(nextUrl.pathname)

    if (requireAuthPage) {
        if (!acessToken || !refreshToken) {
            const response = NextResponse.redirect(new URL("/", url))
            response.cookies.delete("acessToken")
            response.cookies.delete("refreshToken")

            return response
        }

        const validToken = await validateToken(request)

        if (!validToken) {
            const response = NextResponse.redirect(new URL("/", url))
            response.cookies.delete("acessToken")
            response.cookies.delete("refreshToken")

            return response
        }
    } else if (isAuthPage) {
        if (!acessToken || !refreshToken) {
            const response = NextResponse.next()
            response.cookies.delete("acessToken")
            response.cookies.delete("refreshToken")

            return response
        } else {
            const validToken = await validateToken(request)
            return validToken && NextResponse.redirect(new URL("/chat", url))
        }

    }

    return NextResponse.next()
}

export const config = { matcher: ["/", "/chat"] }