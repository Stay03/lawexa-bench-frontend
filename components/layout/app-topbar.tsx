"use client"

import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Menu01Icon,
  Moon02Icon,
  Notification03Icon,
  Search01Icon,
  Sun02Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Crumb {
  label: string
  href: string
}

function buildCrumbs(pathname: string): Crumb[] {
  if (pathname === "/") return [{ label: "Dashboard", href: "/" }]

  const segments = pathname.split("/").filter(Boolean)
  return segments.map((seg, i) => ({
    label: seg
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" "),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }))
}

export function AppTopbar({
  onToggleMobileNav,
}: {
  onToggleMobileNav: () => void
}) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const crumbs = buildCrumbs(pathname)

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-5 lg:px-8">
        {/* Mobile menu trigger */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleMobileNav}
          className="lg:hidden"
        >
          <HugeiconsIcon icon={Menu01Icon} size={18} strokeWidth={1.6} />
          <span className="sr-only">Open navigation</span>
        </Button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-eyebrow text-muted-foreground/80">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1
            return (
              <div key={crumb.href} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="text-muted-foreground/40">/</span>
                )}
                {isLast ? (
                  <span className="text-foreground">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "hidden gap-2 text-muted-foreground hover:text-foreground sm:inline-flex",
            )}
          >
            <HugeiconsIcon icon={Search01Icon} size={15} strokeWidth={1.6} />
            <span className="text-[12.5px]">Search</span>
            <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            className="relative text-muted-foreground hover:text-foreground"
          >
            <HugeiconsIcon
              icon={Notification03Icon}
              size={17}
              strokeWidth={1.5}
            />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
            <span className="sr-only">Notifications</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="text-muted-foreground hover:text-foreground"
          >
            <HugeiconsIcon
              icon={resolvedTheme === "dark" ? Sun02Icon : Moon02Icon}
              size={17}
              strokeWidth={1.5}
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      {/* Hairline gold rule */}
      <div className="rule-gold" />
    </header>
  )
}
