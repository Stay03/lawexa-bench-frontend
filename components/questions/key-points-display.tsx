import { KEY_POINT_CATEGORY_LABEL } from "@/lib/format/question-enums"
import type { KeyPoint } from "@/lib/api/types"

interface KeyPointsDisplayProps {
  points: KeyPoint[]
}

export function KeyPointsDisplay({ points }: KeyPointsDisplayProps) {
  const totalWeight = points.reduce((sum, p) => sum + p.weight, 0) || 1

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <span className="text-eyebrow text-muted-foreground">Key points</span>
        <span className="text-eyebrow-sm tabular text-muted-foreground/60">
          {points.length} {points.length === 1 ? "point" : "points"} · weights
          normalize on export
        </span>
      </div>

      <ul className="flex flex-col">
        {points.map((point) => {
          const pct = Math.round((point.weight / totalWeight) * 100)
          return (
            <li
              key={point.id}
              className="grid grid-cols-[1fr_auto_auto] items-start gap-4 border-b border-border/60 py-3 last:border-b-0"
            >
              <p className="text-[14px] leading-relaxed text-foreground">
                {point.point_text}
              </p>

              <span className="text-eyebrow-sm tabular self-center text-muted-foreground/70">
                {KEY_POINT_CATEGORY_LABEL[point.category]}
              </span>

              <div className="flex flex-col items-end self-center">
                <span className="font-display tabular text-[16px] font-medium leading-none text-foreground">
                  {point.weight}
                </span>
                <span className="text-eyebrow-sm tabular mt-0.5 text-muted-foreground/60">
                  {pct}%
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
