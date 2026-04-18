"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { BookOpen01Icon, RefreshIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Question } from "@/lib/api/types"
import { QuestionRow } from "./question-row"

interface QuestionListProps {
  questions: Question[]
  loading: boolean
  error: string | null
  hasFilters: boolean
  onRetry: () => void
  onClearFilters: () => void
}

function QuestionRowSkeleton() {
  return (
    <div className="border-b border-border/60 py-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="mt-3 h-5 w-11/12" />
      <Skeleton className="mt-2 h-3 w-2/3" />
    </div>
  )
}

export function QuestionList({
  questions,
  loading,
  error,
  hasFilters,
  onRetry,
  onClearFilters,
}: QuestionListProps) {
  if (loading && questions.length === 0) {
    return (
      <div>
        {[0, 1, 2, 3, 4].map((i) => (
          <QuestionRowSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <HugeiconsIcon icon={RefreshIcon} size={20} strokeWidth={1.6} />
        </div>
        <div>
          <h3 className="font-display text-lg font-medium text-foreground">
            Could not load questions
          </h3>
          <p className="mt-1 text-[13px] text-muted-foreground">{error}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="cursor-pointer"
        >
          Try again
        </Button>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground">
          <HugeiconsIcon icon={BookOpen01Icon} size={20} strokeWidth={1.6} />
        </div>
        <div className="max-w-xs">
          <h3 className="font-display text-lg font-medium text-foreground">
            {hasFilters ? "No matches." : "No questions yet."}
          </h3>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {hasFilters
              ? "Try removing a filter or adjusting your search."
              : "Once questions are authored, they will appear here."}
          </p>
        </div>
        {hasFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="cursor-pointer"
          >
            Clear filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {questions.map((question) => (
        <QuestionRow key={question.id} question={question} />
      ))}
    </div>
  )
}
