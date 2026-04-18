import {
  Analytics01Icon,
  ArchiveIcon,
  BookOpen01Icon,
  CheckmarkBadge02Icon,
  Download04Icon,
  Home01Icon,
  TaskDaily01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import type { UserRole } from "@/lib/api/types"

export interface NavItem {
  label: string
  href: string
  icon: IconSvgElement
  minRole?: UserRole
}

export interface NavSection {
  label: string
  marker: string
  items: NavItem[]
}

const ROLE_LEVEL: Record<UserRole, number> = {
  researcher: 1,
  admin: 2,
  super_admin: 3,
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Platform",
    marker: "I",
    items: [
      { label: "Dashboard", href: "/", icon: Home01Icon },
      { label: "Questions", href: "/questions", icon: BookOpen01Icon },
      { label: "Topics", href: "/topics", icon: ArchiveIcon },
    ],
  },
  {
    label: "Review",
    marker: "II",
    items: [
      {
        label: "Review Queue",
        href: "/reviews",
        icon: CheckmarkBadge02Icon,
        minRole: "admin",
      },
      {
        label: "My Claims",
        href: "/claims",
        icon: TaskDaily01Icon,
        minRole: "admin",
      },
    ],
  },
  {
    label: "Insights",
    marker: "III",
    items: [
      { label: "Analytics", href: "/stats", icon: Analytics01Icon },
      { label: "Export", href: "/export", icon: Download04Icon },
    ],
  },
  {
    label: "Administration",
    marker: "IV",
    items: [
      {
        label: "Researchers",
        href: "/researchers",
        icon: UserGroupIcon,
        minRole: "super_admin",
      },
    ],
  },
]

export function filterNavByRole(
  sections: NavSection[],
  role: UserRole | undefined,
): NavSection[] {
  if (!role) return []
  const userLevel = ROLE_LEVEL[role]

  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (!item.minRole) return true
        return userLevel >= ROLE_LEVEL[item.minRole]
      }),
    }))
    .filter((section) => section.items.length > 0)
}
