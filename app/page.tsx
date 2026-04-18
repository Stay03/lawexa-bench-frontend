"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="animate-fade-in w-full max-w-md">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <span className="text-xl font-bold text-primary">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>

            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Welcome, {user?.name || "User"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {user?.email}
              </p>
              <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                {user?.role?.replace("_", " ")}
              </span>
            </div>

            <Button
              variant="outline"
              onClick={logout}
              className="w-full cursor-pointer"
            >
              Sign out
            </Button>

            <p className="text-xs text-muted-foreground">
              Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">d</kbd> to toggle dark mode
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  )
}
