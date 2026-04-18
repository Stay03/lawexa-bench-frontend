import { DIFFICULTY_LABEL, DIFFICULTY_LEVEL } from "@/lib/format/question-enums"
import type { Difficulty } from "@/lib/api/types"
import { cn } from "@/lib/utils"

interface DifficultyMeterProps {
  difficulty: Difficulty
  showLabel?: boolean
  className?: string
}

export function DifficultyMeter({
  difficulty,
  showLabel = true,
  className,
}: DifficultyMeterProps) {
  const level = DIFFICULTY_LEVEL[difficulty]

  return (
    <span
      className={cn(
        "text-eyebrow-sm inline-flex items-center gap-1.5 text-muted-foreground",
        className,
      )}
      title={DIFFICULTY_LABEL[difficulty]}
    >
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={cn(
              "h-2 w-1 rounded-sm",
              n <= level ? "bg-primary" : "bg-muted-foreground/25",
            )}
          />
        ))}
      </span>
      {showLabel && DIFFICULTY_LABEL[difficulty]}
    </span>
  )
}
