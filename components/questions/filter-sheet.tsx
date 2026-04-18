"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { FilterIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
  CognitiveLevel,
  ContaminationRisk,
  Difficulty,
  LegalTradition,
  QuestionListParams,
  QuestionStatus,
  QuestionType,
  Topic,
} from "@/lib/api/types"
import { Combobox } from "./combobox"

interface FilterSheetProps {
  filters: QuestionListParams
  topics: Topic[]
  authors: Author[]
  activeCount: number
  onApply: (patch: Partial<QuestionListParams>) => void
  onReset: () => void
}

interface DraftState {
  topic?: string
  question_type?: QuestionType
  cognitive_level?: CognitiveLevel
  difficulty?: Difficulty
  legal_tradition?: LegalTradition
  contamination_risk?: ContaminationRisk
  status?: QuestionStatus
  author_id?: string
}

function readDraft(filters: QuestionListParams): DraftState {
  return {
    topic: filters.topic,
    question_type: filters.question_type,
    cognitive_level: filters.cognitive_level,
    difficulty: filters.difficulty,
    legal_tradition: filters.legal_tradition,
    contamination_risk: filters.contamination_risk,
    status: filters.status,
    author_id: filters.author_id,
  }
}

function selectValue(value: string | undefined): string {
  return value ?? "__all__"
}

function fromSelectValue<T extends string>(value: string): T | undefined {
  return value === "__all__" ? undefined : (value as T)
}

export function FilterSheet({
  filters,
  topics,
  authors,
  activeCount,
  onApply,
  onReset,
}: FilterSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 cursor-pointer gap-2 text-[13px]"
        >
          <HugeiconsIcon icon={FilterIcon} size={14} strokeWidth={1.6} />
          Filters
          {activeCount > 0 && (
            <span className="tabular ml-1 rounded-full bg-primary/15 px-1.5 text-[10px] font-semibold text-primary">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <FilterSheetBody
          initialFilters={filters}
          topics={topics}
          authors={authors}
          onApply={(patch) => {
            onApply(patch)
            setOpen(false)
          }}
          onClear={() => {
            onReset()
            setOpen(false)
          }}
        />
      </SheetContent>
    </Sheet>
  )
}

interface FilterSheetBodyProps {
  initialFilters: QuestionListParams
  topics: Topic[]
  authors: Author[]
  onApply: (patch: Partial<QuestionListParams>) => void
  onClear: () => void
}

function FilterSheetBody({
  initialFilters,
  topics,
  authors,
  onApply,
  onClear,
}: FilterSheetBodyProps) {
  // Mounts fresh each time the sheet opens (Radix unmounts SheetContent on close),
  // so this initializer captures the latest applied filters.
  const [draft, setDraft] = useState<DraftState>(() => readDraft(initialFilters))

  function update<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  return (
    <>
      <SheetHeader className="border-b border-border px-6 py-5">
        <div className="text-eyebrow mb-1 text-primary">Refine</div>
        <SheetTitle className="font-display text-2xl font-medium tracking-tight">
          Filter questions
        </SheetTitle>
        <SheetDescription className="text-[13px]">
          Narrow the list by topic, type, status, and more.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-5">
          <FilterField label="Topic">
            <Combobox
              value={draft.topic}
              onChange={(v) => update("topic", v)}
              options={topics.map((t) => ({ value: t.slug, label: t.name }))}
              placeholder="Any topic"
              searchPlaceholder="Search topics..."
              emptyText="No topics found."
            />
          </FilterField>

          <FilterField label="Author">
            <Combobox
              value={draft.author_id}
              onChange={(v) => update("author_id", v)}
              options={authors.map((a) => ({ value: a.id, label: a.name }))}
              placeholder="Any author"
              searchPlaceholder="Search authors..."
              emptyText="No authors found."
            />
          </FilterField>

          <div className="grid grid-cols-2 gap-4">
            <FilterField label="Status">
              <EnumSelect
                value={draft.status}
                onChange={(v) => update("status", v as QuestionStatus)}
                labels={STATUS_LABEL}
                allLabel="Any status"
              />
            </FilterField>

            <FilterField label="Type">
              <EnumSelect
                value={draft.question_type}
                onChange={(v) => update("question_type", v as QuestionType)}
                labels={QUESTION_TYPE_LABEL}
                allLabel="Any type"
              />
            </FilterField>

            <FilterField label="Difficulty">
              <EnumSelect
                value={draft.difficulty}
                onChange={(v) => update("difficulty", v as Difficulty)}
                labels={DIFFICULTY_LABEL}
                allLabel="Any difficulty"
              />
            </FilterField>

            <FilterField label="Cognitive level">
              <EnumSelect
                value={draft.cognitive_level}
                onChange={(v) =>
                  update("cognitive_level", v as CognitiveLevel)
                }
                labels={COGNITIVE_LEVEL_LABEL}
                allLabel="Any level"
              />
            </FilterField>

            <FilterField label="Legal tradition">
              <EnumSelect
                value={draft.legal_tradition}
                onChange={(v) =>
                  update("legal_tradition", v as LegalTradition)
                }
                labels={LEGAL_TRADITION_LABEL}
                allLabel="Any tradition"
              />
            </FilterField>

            <FilterField label="Contamination">
              <EnumSelect
                value={draft.contamination_risk}
                onChange={(v) =>
                  update("contamination_risk", v as ContaminationRisk)
                }
                labels={CONTAMINATION_LABEL}
                allLabel="Any risk"
              />
            </FilterField>
          </div>
        </div>
      </div>

      <SheetFooter className="flex-row items-center justify-between border-t border-border px-6 py-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="cursor-pointer text-muted-foreground hover:text-foreground"
        >
          Clear all
        </Button>
        <div className="flex gap-2">
          <SheetClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="button"
            size="sm"
            onClick={() => onApply(draft)}
            className="cursor-pointer"
          >
            Apply filters
          </Button>
        </div>
      </SheetFooter>
    </>
  )
}

function FilterField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-eyebrow-sm text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

interface EnumSelectProps<T extends string> {
  value: T | undefined
  onChange: (value: T | undefined) => void
  labels: Record<T, string>
  allLabel: string
}

function EnumSelect<T extends string>({
  value,
  onChange,
  labels,
  allLabel,
}: EnumSelectProps<T>) {
  return (
    <Select
      value={selectValue(value)}
      onValueChange={(v) => onChange(fromSelectValue<T>(v))}
    >
      <SelectTrigger size="sm" className="h-9 text-[13px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          value="__all__"
          className="text-[13px] text-muted-foreground"
        >
          {allLabel}
        </SelectItem>
        {(Object.entries(labels) as [T, string][]).map(([val, label]) => (
          <SelectItem key={val} value={val} className="text-[13px]">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
