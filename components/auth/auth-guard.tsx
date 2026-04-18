"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import type { UserRole } from "@/lib/api/types"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

const ROLE_LEVEL: Record<UserRole, number> = {
  researcher: 1,
  admin: 2,
  super_admin: 3,
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { status, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-fade-in [animation-delay:500ms]">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  if (requiredRole && user) {
    const userLevel = ROLE_LEVEL[user.role]
    const requiredLevel = ROLE_LEVEL[requiredRole]

    if (userLevel < requiredLevel) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="animate-fade-in flex flex-col items-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <svg
                className="size-6 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Access Denied
            </h2>
            <p className="max-w-xs text-sm text-muted-foreground">
              You don&apos;t have permission to access this page. Contact an
              administrator if you believe this is an error.
            </p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}
