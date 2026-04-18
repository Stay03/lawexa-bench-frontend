"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginButton } from "@/components/auth/login-button"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const { status } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/")
    }
  }, [status, router])

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="animate-fade-in w-full max-w-sm">
        <div className="flex flex-col items-center gap-8">
          {/* Logo & Branding */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2.5">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                className="text-primary"
              >
                <rect
                  x="2"
                  y="4"
                  width="32"
                  height="28"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <path
                  d="M10 12h4v12h8v-4"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="8"
                  y="2"
                  width="20"
                  height="4"
                  rx="2"
                  fill="currentColor"
                />
              </svg>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Lawexa{" "}
                <span className="font-normal text-muted-foreground">
                  Bench
                </span>
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Legal AI Benchmark Platform
            </p>
          </div>

          {/* Login Card */}
          <div className="animate-fade-in-up w-full rounded-xl border border-border bg-card p-6 shadow-sm [animation-delay:150ms]">
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <h2 className="text-base font-medium text-foreground">
                  Welcome back
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sign in with your Lawexa account to continue
                </p>
              </div>

              <LoginButton />

              <p className="text-center text-xs text-muted-foreground">
                Only researchers, admins, and super admins can access this
                platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
