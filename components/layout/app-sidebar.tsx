"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { JusticeScale01Icon } from "@hugeicons/core-free-icons"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { filterNavByRole, NAV_SECTIONS } from "./nav-config"
import { UserMenu } from "./user-menu"

export function AppSidebar() {
  const { user } = useAuth()
  const pathname = usePathname()

  const sections = filterNavByRole(NAV_SECTIONS, user?.role)

  return (
    <aside className="paper-grain fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-sidebar lg:flex">
      {/* Wordmark */}
      <div className="px-6 pt-7 pb-6">
        <Link href="/" className="group inline-flex items-baseline gap-2">
          <HugeiconsIcon
            icon={JusticeScale01Icon}
            size={22}
            strokeWidth={1.6}
            className="translate-y-[3px] text-primary transition-transform group-hover:rotate-[-6deg]"
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
      </div>

      <div className="rule-gold mx-6" />

      {/* Navigation */}
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
                        className={cn(
                          "group/link relative flex items-center gap-3 rounded-md px-3 py-2 text-[13.5px] transition-colors",
                          active
                            ? "bg-accent text-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
                        )}
                      >
                        {/* Gold rail on active */}
                        {active && (
                          <span className="absolute -left-3 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r bg-primary" />
                        )}

                        <HugeiconsIcon
                          icon={item.icon}
                          size={17}
                          strokeWidth={active ? 1.8 : 1.5}
                          className={cn(
                            "shrink-0 transition-colors",
                            active
                              ? "text-primary"
                              : "text-muted-foreground/80 group-hover/link:text-foreground",
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

      {/* User card */}
      <div className="border-t border-border p-3">
        <UserMenu />
      </div>
    </aside>
  )
}
