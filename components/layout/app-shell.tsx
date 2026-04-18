"use client"

import { useState } from "react"
import { AppSidebar } from "./app-sidebar"
import { AppTopbar } from "./app-topbar"
import { MobileNav } from "./mobile-nav"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="lg:pl-64">
        <AppTopbar onToggleMobileNav={() => setMobileNavOpen(true)} />

        <main className="paper-grain relative min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
