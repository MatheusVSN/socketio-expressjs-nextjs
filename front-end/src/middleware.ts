import { NextRequest } from "next/server";

export const middleware = (request: NextRequest) => {
    const user = request.cookies.get("currentUser")?.value

    console.log(user)
}