"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import {
  COGNITIVE_LEVEL_LABEL,
  CONTAMINATION_LABEL,
  DIFFICULTY_LABEL,
  LEGAL_TRADITION_LABEL,
  QUESTION_TYPE_LABEL,
  STATUS_LABEL,
} from "@/lib/format/question-enums"
import type {
  Author,
  QuestionListParams,
  Topic,
} from "@/lib/api/types"
import { cn } from "@/lib/utils"

interface ActiveFilterChipsProps {
  filters: QuestionListParams
  topics: Topic[]
  authors: Author[]
  onRemove: (patch: Partial<QuestionListParams>) => void
  onClearAll: () => void
}

interface Chip {
  key: keyof QuestionListParams
  label: string
  value: string
}

export function ActiveFilterChips({
  filters,
  topics,
  authors,
  onRemove,
  onClearAll,
}: ActiveFilterChipsProps) {
  const chips: Chip[] = []

  if (filters.q) {
    chips.push({ key: "q", label: "Search", value: `“${filters.q}”` })
  }
  if (filters.topic) {
    const topic = topics.find((t) => t.slug === filters.topic)
    chips.push({
      key: "topic",
      label: "Topic",
      value: topic?.name ?? filters.topic,
    })
  }
  if (filters.status) {
    chips.push({
      key: "status",
      label: "Status",
      value: STATUS_LABEL[filters.status],
    })
  }
  if (filters.question_type) {
    chips.push({
      key: "question_type",
      label: "Type",
      value: QUESTION_TYPE_LABEL[filters.question_type],
    })
  }
  if (filters.difficulty) {
    chips.push({
      key: "difficulty",
      label: "Difficulty",
      value: DIFFICULTY_LABEL[filters.difficulty],
    })
  }
  if (filters.cognitive_level) {
    chips.push({
      key: "cognitive_level",
      label: "Cognitive",
      value: COGNITIVE_LEVEL_LABEL[filters.cognitive_level],
    })
  }
  if (filters.legal_tradition) {
    chips.push({
      key: "legal_tradition",
      label: "Tradition",
      value: LEGAL_TRADITION_LABEL[filters.legal_tradition],
    })
  }
  if (filters.contamination_risk) {
    chips.push({
      key: "contamination_risk",
      label: "Contamination",
      value: CONTAMINATION_LABEL[filters.contamination_risk],
    })
  }
  if (filters.author_id) {
    const author = authors.find((a) => a.id === filters.author_id)
    chips.push({
      key: "author_id",
      label: "Author",
      value: author?.name ?? "Selected",
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <ChipPill
          key={chip.key}
          label={chip.label}
          value={chip.value}
          onRemove={() =>
            onRemove({ [chip.key]: undefined } as Partial<QuestionListParams>)
          }
        />
      ))}
      {chips.length >= 2 && (
        <button
          onClick={onClearAll}
          className="text-eyebrow-sm cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
        >
          Clear all
        </button>
      )}
    </div>
  )
}

function ChipPill({
  label,
  value,
  onRemove,
}: {
  label: string
  value: string
  onRemove: () => void
}) {
  return (
    <span
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 py-1 pl-2.5 pr-1 text-[12px]",
        "transition-colors hover:bg-muted/60",
      )}
    >
      <span className="text-eyebrow-sm text-muted-foreground/70">{label}</span>
      <span className="text-foreground">{value}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 inline-flex size-4 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={10} strokeWidth={2} />
        <span className="sr-only">Remove {label} filter</span>
      </button>
    </span>
  )
}
