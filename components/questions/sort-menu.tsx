"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDataTransferVerticalIcon } from "@hugeicons/core-free-icons"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { QuestionOrderBy } from "@/lib/api/types"

interface SortMenuProps {
  value: QuestionOrderBy
  onChange: (value: QuestionOrderBy) => void
}

const SORT_OPTIONS: { value: QuestionOrderBy; label: string }[] = [
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "-updated_at", label: "Recently updated" },
  { value: "updated_at", label: "Least recently updated" },
  { value: "-difficulty", label: "Hardest first" },
  { value: "difficulty", label: "Easiest first" },
]

export function SortMenu({ value, onChange }: SortMenuProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as QuestionOrderBy)}>
      <SelectTrigger size="sm" className="h-9 min-w-[170px] gap-2 text-[13px]">
        <HugeiconsIcon
          icon={ArrowDataTransferVerticalIcon}
          size={13}
          strokeWidth={1.6}
          className="text-muted-foreground"
        />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-[13px]">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
