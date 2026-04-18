import { cn } from "@/lib/utils"
import { CONTAMINATION_LABEL } from "@/lib/format/question-enums"
import type { ContaminationRisk } from "@/lib/api/types"

interface ContaminationBadgeProps {
  risk: ContaminationRisk
  className?: string
}

const STYLE: Record<ContaminationRisk, string> = {
  low: "text-muted-foreground",
  medium: "text-amber-700 dark:text-amber-400",
  high: "text-destructive",
}

const DOT: Record<ContaminationRisk, string> = {
  low: "bg-muted-foreground/40",
  medium: "bg-amber-500",
  high: "bg-destructive",
}

export function ContaminationBadge({ risk, className }: ContaminationBadgeProps) {
  return (
    <span
      className={cn(
        "text-eyebrow-sm inline-flex items-center gap-1.5",
        STYLE[risk],
        className,
      )}
      title={`Contamination risk: ${CONTAMINATION_LABEL[risk]}`}
    >
      <span className={cn("size-1.5 rounded-full", DOT[risk])} />
      {CONTAMINATION_LABEL[risk]} contamination
    </span>
  )
}
