interface ErroResponse {
    message: string
}

export const fetchWrapper = async <T = unknown>(input: RequestInfo | URL, init?: RequestInit | undefined) => {
    const data = await fetch(`http://localhost:3333${input}`, {
        headers: {
            "Content-Type": "application/json",
        },
        ...init
    })
    const result = await data.json()

    return { status: data.status, result } as { status: number, result: T | ErroResponse }
}
