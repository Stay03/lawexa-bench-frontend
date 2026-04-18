import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon } from "@hugeicons/core-free-icons"
import type { McqOption } from "@/lib/api/types"
import { cn } from "@/lib/utils"

interface McqOptionsDisplayProps {
  options: McqOption[]
  isMultiSelect: boolean
}

const LETTERS = ["A", "B", "C", "D", "E", "F"]

export function McqOptionsDisplay({
  options,
  isMultiSelect,
}: McqOptionsDisplayProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-eyebrow text-muted-foreground">Options</span>
        {isMultiSelect && (
          <span className="text-eyebrow-sm text-primary">Multi-select</span>
        )}
      </div>

      <ol className="flex flex-col gap-2">
        {options.map((opt, i) => (
          <li
            key={opt.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors",
              opt.is_correct
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-card",
            )}
          >
            <span
              className={cn(
                "font-display tabular flex size-7 shrink-0 items-center justify-center rounded-full border text-[13px] font-medium",
                opt.is_correct
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground",
              )}
            >
              {LETTERS[i] ?? i + 1}
            </span>
            <span className="flex-1 pt-0.5 text-[14px] leading-relaxed text-foreground">
              {opt.text}
            </span>
            {opt.is_correct && (
              <span className="flex shrink-0 items-center gap-1.5 pt-1 text-primary">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={14}
                  strokeWidth={2}
                />
                <span className="text-eyebrow-sm">Correct</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
