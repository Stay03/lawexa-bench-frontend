import Link from "next/link"
import {
  COGNITIVE_LEVEL_LABEL,
  formatRelativeTime,
  LEGAL_TRADITION_LABEL,
  QUESTION_TYPE_LABEL,
} from "@/lib/format/question-enums"
import type { Question } from "@/lib/api/types"
import { DifficultyMeter } from "./difficulty-meter"
import { StatusBadge } from "./status-badge"

interface QuestionRowProps {
  question: Question
}

export function QuestionRow({ question }: QuestionRowProps) {
  return (
    <Link
      href={`/questions/${question.id}`}
      className="group block border-b border-border/60 py-5 transition-colors last:border-b-0 hover:bg-accent/20"
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          {/* Top metadata row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <StatusBadge status={question.status} />
            <span className="text-muted-foreground/30">·</span>
            <span className="text-eyebrow-sm text-muted-foreground/80">
              {QUESTION_TYPE_LABEL[question.question_type]}
            </span>
            <span className="text-muted-foreground/30">·</span>
            <DifficultyMeter difficulty={question.difficulty} showLabel />
            <span className="text-muted-foreground/30">·</span>
            <span className="text-eyebrow-sm text-muted-foreground/80">
              {COGNITIVE_LEVEL_LABEL[question.cognitive_level]}
            </span>
          </div>

          {/* Question text */}
          <p className="font-display mt-2.5 line-clamp-2 text-[16.5px] leading-snug font-medium text-foreground transition-colors group-hover:text-primary">
            {question.text}
          </p>

          {/* Footer row */}
          <div className="text-eyebrow-sm mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground/70">
            <span className="text-foreground/70">
              {question.topic_name || "—"}
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span>{question.author_name}</span>
            <span className="text-muted-foreground/30">·</span>
            <span>{LEGAL_TRADITION_LABEL[question.legal_tradition]}</span>
            <span className="text-muted-foreground/30">·</span>
            <span className="tabular">
              {formatRelativeTime(question.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
