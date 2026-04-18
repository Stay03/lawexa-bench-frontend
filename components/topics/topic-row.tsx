"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Edit02Icon,
  MoreHorizontalIcon,
  RefreshIcon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Topic } from "@/lib/api/types"
import { cn } from "@/lib/utils"
import { TopicStatusBadge } from "./topic-status-badge"

interface TopicRowProps {
  topic: Topic
  canManage: boolean
  onEdit: (topic: Topic) => void
  onDeactivate: (topic: Topic) => void
  onReactivate: (topic: Topic) => void
}

export function TopicRow({
  topic,
  canManage,
  onEdit,
  onDeactivate,
  onReactivate,
}: TopicRowProps) {
  return (
    <div
      className={cn(
        "group grid grid-cols-[1fr_auto] items-start gap-4 border-b border-border/60 py-5 transition-opacity last:border-b-0 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-6",
        !topic.is_active && "opacity-60",
      )}
    >
      {/* Name + slug + description */}
      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          <Link
            href={`/topics/${topic.id}`}
            className="font-display text-[18px] font-medium tracking-tight text-foreground transition-colors hover:text-primary"
          >
            {topic.name}
          </Link>
          <code className="text-eyebrow-sm hidden font-mono text-muted-foreground/60 sm:inline">
            {topic.slug}
          </code>
        </div>

        {topic.description && (
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
            {topic.description}
          </p>
        )}

        <code className="text-eyebrow-sm mt-2 inline font-mono text-muted-foreground/60 sm:hidden">
          {topic.slug}
        </code>
      </div>

      {/* Question count */}
      <div
        className="text-eyebrow-sm tabular hidden text-muted-foreground/70 sm:block"
        title={`${topic.question_count} ${topic.question_count === 1 ? "question" : "questions"}`}
      >
        {topic.question_count}
      </div>

      {/* Status */}
      <div className="hidden sm:block">
        <TopicStatusBadge active={topic.is_active} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1">
        {canManage ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
              >
                <HugeiconsIcon
                  icon={MoreHorizontalIcon}
                  size={16}
                  strokeWidth={1.6}
                />
                <span className="sr-only">Topic actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onSelect={() => onEdit(topic)}
                className="gap-2.5 cursor-pointer"
              >
                <HugeiconsIcon
                  icon={Edit02Icon}
                  size={14}
                  strokeWidth={1.6}
                />
                <span className="text-[13px]">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {topic.is_active ? (
                <DropdownMenuItem
                  onSelect={() => onDeactivate(topic)}
                  className="gap-2.5 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <HugeiconsIcon
                    icon={UnavailableIcon}
                    size={14}
                    strokeWidth={1.6}
                  />
                  <span className="text-[13px]">Deactivate</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onSelect={() => onReactivate(topic)}
                  className="gap-2.5 cursor-pointer text-primary focus:bg-primary/10 focus:text-primary"
                >
                  <HugeiconsIcon
                    icon={RefreshIcon}
                    size={14}
                    strokeWidth={1.6}
                  />
                  <span className="text-[13px]">Reactivate</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span className="size-8" aria-hidden />
        )}
      </div>
    </div>
  )
}
