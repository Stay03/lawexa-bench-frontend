import { cn } from "@/lib/utils"

interface TopicStatusBadgeProps {
  active: boolean
  className?: string
}

export function TopicStatusBadge({ active, className }: TopicStatusBadgeProps) {
  return (
    <span
      className={cn(
        "text-eyebrow-sm inline-flex items-center gap-1.5",
        active ? "text-foreground" : "text-muted-foreground/60",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          active ? "bg-primary" : "bg-muted-foreground/40",
        )}
      />
      {active ? "Active" : "Inactive"}
    </span>
  )
}
