"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, JusticeScale01Icon } from "@hugeicons/core-free-icons"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { filterNavByRole, NAV_SECTIONS } from "./nav-config"
import { UserMenu } from "./user-menu"

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const sections = filterNavByRole(NAV_SECTIONS, user?.role)

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "paper-grain absolute inset-y-0 left-0 flex w-72 flex-col border-r border-border bg-sidebar transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 pt-7 pb-6">
          <Link
            href="/"
            onClick={onClose}
            className="inline-flex items-baseline gap-2"
          >
            <HugeiconsIcon
              icon={JusticeScale01Icon}
              size={22}
              strokeWidth={1.6}
              className="translate-y-[3px] text-primary"
            />
            <div className="flex flex-col leading-none">
              <span className="font-display text-[19px] font-semibold tracking-tight text-foreground">
                Lawexa
              </span>
              <span className="font-display-italic mt-0.5 text-[13px] text-muted-foreground">
                Bench
              </span>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-muted-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.6} />
            <span className="sr-only">Close navigation</span>
          </Button>
        </div>

        <div className="rule-gold mx-6" />

        <nav className="flex-1 overflow-y-auto px-3 pt-6 pb-4">
          <div className="flex flex-col gap-7">
            {sections.map((section) => (
              <div key={section.label} className="flex flex-col gap-1.5">
                <div className="flex items-baseline gap-2 px-3 pb-1">
                  <span className="font-display-italic tabular text-[10px] text-primary/60">
                    {section.marker}.
                  </span>
                  <span className="text-eyebrow-sm text-muted-foreground/70">
                    {section.label}
                  </span>
                </div>

                <ul className="flex flex-col gap-px">
                  {section.items.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href))

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] transition-colors",
                            active
                              ? "bg-accent text-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
                          )}
                        >
                          <HugeiconsIcon
                            icon={item.icon}
                            size={17}
                            strokeWidth={active ? 1.8 : 1.5}
                            className={cn(
                              "shrink-0",
                              active ? "text-primary" : "text-muted-foreground/80",
                            )}
                          />
                          <span className="flex-1 truncate">{item.label}</span>
                          {active && (
                            <span className="size-1 rounded-full bg-primary" />
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <div className="border-t border-border p-3">
          <UserMenu />
        </div>
      </aside>
    </div>
  )
}
