"use client"

import { useEffect, useState } from "react"
import { Profile } from "@/types"
import { fetchWrapper } from "@/lib/fetch"
import { useRouter } from "next/navigation"

const loadUserInformation = async () => {
    const profileResponse = await fetchWrapper<{ data: Profile }>("/api/profile", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    if (profileResponse.status !== 200) return

    return {
        id: profileResponse.result.data.id,
        email: profileResponse.result.data.email,
        username: profileResponse.result.data.username
    }
}

export const useCurrentUser = () => {
    const [user, setUser] = useState<Profile | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter()

    const logOut = async () => {
        await fetchWrapper("/api/logout")
        setUser(() => null)
        router.push("/")
    }

    const getUserInformation = async () => {
        setLoading(() => true)
        const userInformation = await loadUserInformation()
        if (userInformation) {
            setUser(() => userInformation)
        }
        setLoading(() => false)
    }

    useEffect(() => {
        (async () => {
            setLoading(() => true)
            const userInformation = await loadUserInformation()
            if (userInformation) {
                setUser(() => userInformation)
            }
            setLoading(() => false)
        })()
    }, [])


    return { user, loading, logOut, getUserInformation }
}