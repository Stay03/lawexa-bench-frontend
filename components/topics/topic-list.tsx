"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArchiveIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Topic } from "@/lib/api/types"
import { TopicRow } from "./topic-row"

interface TopicListProps {
  topics: Topic[]
  loading: boolean
  error: string | null
  canManage: boolean
  onRetry: () => void
  onEdit: (topic: Topic) => void
  onDeactivate: (topic: Topic) => void
  onReactivate: (topic: Topic) => void
}

function TopicSkeleton() {
  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-4 border-b border-border/60 py-5 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-3.5 w-72 max-w-full" />
      </div>
      <Skeleton className="hidden h-4 w-6 sm:block" />
      <Skeleton className="hidden h-4 w-14 sm:block" />
      <Skeleton className="size-8 rounded-md" />
    </div>
  )
}

export function TopicList({
  topics,
  loading,
  error,
  canManage,
  onRetry,
  onEdit,
  onDeactivate,
  onReactivate,
}: TopicListProps) {
  if (loading && topics.length === 0) {
    return (
      <div>
        {[0, 1, 2, 3].map((i) => (
          <TopicSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error && topics.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <HugeiconsIcon icon={RefreshIcon} size={20} strokeWidth={1.6} />
        </div>
        <div>
          <h3 className="font-display text-lg font-medium text-foreground">
            Could not load topics
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

  if (topics.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground">
          <HugeiconsIcon icon={ArchiveIcon} size={20} strokeWidth={1.6} />
        </div>
        <div className="max-w-xs">
          <h3 className="font-display text-lg font-medium text-foreground">
            No topics yet
          </h3>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {canManage
              ? "Create your first topic to start organizing the bench by practice area."
              : "Topics will appear here once an administrator adds them."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {topics.map((topic) => (
        <TopicRow
          key={topic.id}
          topic={topic}
          canManage={canManage}
          onEdit={onEdit}
          onDeactivate={onDeactivate}
          onReactivate={onReactivate}
        />
      ))}
    </div>
  )
}
