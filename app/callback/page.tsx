"use client"

import { useEffect } from "react"

export default function CallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    const hash = window.location.hash

    const grantToken = token || new URLSearchParams(hash.slice(1)).get("token")

    if (grantToken && window.opener) {
      window.opener.postMessage(
        { type: "lawexa:grant", token: grantToken },
        window.location.origin,
      )
      window.close()
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Completing login...</p>
    </div>
  )
}
