"use client"

import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Logout02Icon,
  Moon02Icon,
  MoreHorizontalCircle01Icon,
  Sun02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

const ROLE_LABEL: Record<string, string> = {
  researcher: "Researcher",
  admin: "Admin",
  super_admin: "Super Admin",
}

export function UserMenu() {
  const { user, logout } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()

  if (!user) return null

  const initial = user.name?.charAt(0)?.toUpperCase() ?? "?"
  const roleLabel = ROLE_LABEL[user.role] ?? user.role

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group/user flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors outline-none hover:bg-accent/40 focus-visible:bg-accent/40">
        <Avatar className="size-8 border border-border">
          <AvatarFallback className="font-display bg-primary/10 text-[13px] font-semibold text-primary">
            {initial}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate text-[13px] font-medium text-foreground">
            {user.name}
          </span>
          <span className="text-eyebrow-sm truncate text-muted-foreground/70">
            {roleLabel}
          </span>
        </div>

        <HugeiconsIcon
          icon={MoreHorizontalCircle01Icon}
          size={16}
          strokeWidth={1.5}
          className="shrink-0 text-muted-foreground/60 opacity-0 transition-opacity group-hover/user:opacity-100"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-60"
      >
        <DropdownMenuLabel className="flex flex-col gap-0.5 px-3 py-2.5">
          <span className="text-[13px] font-medium text-foreground">
            {user.name}
          </span>
          <span className="truncate text-[11px] font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2.5 cursor-pointer">
          <HugeiconsIcon icon={UserIcon} size={15} strokeWidth={1.5} />
          <span className="text-[13px]">Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }}
          className="gap-2.5 cursor-pointer"
        >
          <HugeiconsIcon
            icon={resolvedTheme === "dark" ? Sun02Icon : Moon02Icon}
            size={15}
            strokeWidth={1.5}
          />
          <span className="text-[13px]">
            {resolvedTheme === "dark" ? "Light" : "Dark"} mode
          </span>
          <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            D
          </kbd>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={logout}
          className="gap-2.5 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <HugeiconsIcon icon={Logout02Icon} size={15} strokeWidth={1.5} />
          <span className="text-[13px]">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
