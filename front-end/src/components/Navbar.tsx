"use client"

import { useCurrentUser } from "@/hooks/useCurrentUser"
import ThemeToggle from "./ThemeToggle"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Skeleton } from "./ui/skeleton"
import { useEffect } from "react"

export default function NavigationBarComponent() {
  const { user, loading, logOut } = useCurrentUser()

  return (
    <header className="supports-backdrop-blur:bg-slate-50/60 fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <nav className="container flex h-14 items-center">
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          {loading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : (
            user && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Button
                        className="w-full"
                        variant="ghost"
                        onClick={logOut}>
                        Sign out
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )
          )}
        </div>
      </nav>
    </header>
  )
}
