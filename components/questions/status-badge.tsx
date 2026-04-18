import { cn } from "@/lib/utils"
import { STATUS_LABEL } from "@/lib/format/question-enums"
import type { QuestionStatus } from "@/lib/api/types"

interface StatusBadgeProps {
  status: QuestionStatus
  size?: "sm" | "md"
  className?: string
}

const STATUS_STYLE: Record<
  QuestionStatus,
  { dot: string; text: string; ring?: string }
> = {
  draft: {
    dot: "bg-muted-foreground/40 ring-2 ring-muted-foreground/10",
    text: "text-muted-foreground",
  },
  in_review: {
    dot: "bg-amber-500 ring-2 ring-amber-500/15",
    text: "text-amber-700 dark:text-amber-400",
  },
  approved: {
    dot: "bg-primary ring-2 ring-primary/15",
    text: "text-primary",
  },
  rejected: {
    dot: "bg-destructive ring-2 ring-destructive/15",
    text: "text-destructive",
  },
}

export function StatusBadge({
  status,
  size = "sm",
  className,
}: StatusBadgeProps) {
  const style = STATUS_STYLE[status]
  const isMd = size === "md"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap",
        isMd ? "text-eyebrow" : "text-eyebrow-sm",
        style.text,
        className,
      )}
    >
      <span
        className={cn("rounded-full", isMd ? "size-2" : "size-1.5", style.dot)}
      />
      {STATUS_LABEL[status]}
    </span>
  )
}
