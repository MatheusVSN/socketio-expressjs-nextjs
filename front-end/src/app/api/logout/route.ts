import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    const response = NextResponse.json({ message: "Log out succesfully" }, { status: 200 })

    response.cookies.delete("acessToken")
    response.cookies.delete("refreshToken")

    return response
}