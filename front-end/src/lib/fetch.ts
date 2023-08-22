export const fetchWrapper = async <T = unknown>(input: RequestInfo | URL, init?: RequestInit | undefined) => {
    const data = await fetch(`${input}`, {
        ...init
    })
    const result = await data.json()

    return { status: data.status, result } as { status: number, result: T }
}

export const serverFetchWrapper = async <T = unknown>(input: RequestInfo | URL, init?: RequestInit | undefined) => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${input}`, {
        ...init
    })

    const result = await data.json()

    return { status: data.status, result } as { status: number, result: T }
}