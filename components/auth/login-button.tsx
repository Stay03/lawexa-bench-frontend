"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import {
  LAWEXA_AUTH_URL,
  LAWEXA_CLIENT_ID,
  LAWEXA_ORIGIN,
} from "@/lib/config"

export function LoginButton() {
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const popupRef = useRef<Window | null>(null)

  const handleMessage = useCallback(
    async (event: MessageEvent) => {
      if (event.origin !== LAWEXA_ORIGIN) return
      if (event.data?.type !== "lawexa:grant") return

      const scopedToken = event.data.token as string
      if (!scopedToken) return

      setLoading(true)
      setError(null)

      try {
        await login(scopedToken)
        router.push("/")
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Login failed. Please try again.",
        )
      } finally {
        setLoading(false)
        popupRef.current?.close()
      }
    },
    [login, router],
  )

  useEffect(() => {
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [handleMessage])

  function openPopup() {
    setError(null)
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/callback`,
    )
    const url = `${LAWEXA_AUTH_URL}?client_id=${LAWEXA_CLIENT_ID}&redirect_uri=${redirectUri}`

    popupRef.current = window.open(
      url,
      "lawexa-auth",
      "width=480,height=600,popup=yes",
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        onClick={openPopup}
        disabled={loading}
        size="lg"
        className="w-full cursor-pointer text-base font-semibold"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="size-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Connecting...
          </span>
        ) : (
          "Login with Lawexa"
        )}
      </Button>

      {error && (
        <p className="animate-fade-in text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
