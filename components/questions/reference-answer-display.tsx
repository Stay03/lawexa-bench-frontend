import type { ReferenceAnswer } from "@/lib/api/types"

interface ReferenceAnswerDisplayProps {
  answer: ReferenceAnswer
}

export function ReferenceAnswerDisplay({ answer }: ReferenceAnswerDisplayProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-eyebrow text-muted-foreground">
        Reference answer
      </span>
      <div className="rounded-lg border border-border bg-card px-5 py-4">
        <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-foreground">
          {answer.answer_text}
        </p>
      </div>
    </div>
  )
}
