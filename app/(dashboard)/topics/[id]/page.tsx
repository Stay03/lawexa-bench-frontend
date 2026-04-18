"use client"

import { use, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Edit02Icon,
  RefreshIcon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DeactivateConfirm } from "@/components/topics/deactivate-confirm"
import { TopicFormDialog } from "@/components/topics/topic-form-dialog"
import { TopicStatusBadge } from "@/components/topics/topic-status-badge"
import { useAuth } from "@/hooks/use-auth"
import { getTopic, updateTopic } from "@/lib/api/endpoints/topics"
import { ApiError } from "@/lib/api/errors"
import type { Topic } from "@/lib/api/types"

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TopicDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { isAdmin } = useAuth()

  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorStatus, setErrorStatus] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [deactivateOpen, setDeactivateOpen] = useState(false)

  const fetchTopic = useCallback(async () => {
    setLoading(true)
    setErrorStatus(null)
    setErrorMessage(null)
    try {
      const data = await getTopic(id)
      setTopic(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorStatus(err.status)
        setErrorMessage(err.message)
      } else {
        setErrorMessage("An unexpected error occurred.")
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTopic()
  }, [fetchTopic])

  function handleSaved(saved: Topic) {
    setTopic(saved)
  }

  function handleDeactivated(deactivated: Topic) {
    setTopic(deactivated)
  }

  async function handleReactivate() {
    if (!topic) return
    try {
      const updated = await updateTopic(topic.id, { is_active: true })
      setTopic(updated)
    } catch (err) {
      console.warn("Reactivation failed", err)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10 lg:px-10 lg:py-14">
      {/* Eyebrow row */}
      <div className="animate-fade-in flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-display-italic tabular text-sm text-primary/70">
            II.
          </span>
          <span className="text-eyebrow text-muted-foreground/70">Topic</span>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <Link href="/topics">
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={14}
              strokeWidth={1.8}
            />
            All topics
          </Link>
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="animate-fade-in mt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {/* 404 — Not found */}
      {!loading && errorStatus === 404 && (
        <div className="animate-fade-in mt-16 flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-foreground">
            Topic not found.
          </h2>
          <p className="max-w-sm text-[14px] text-muted-foreground">
            This topic may have been removed, or the link is incorrect.
          </p>
          <Button asChild variant="outline" className="cursor-pointer mt-2">
            <Link href="/topics">Back to topics</Link>
          </Button>
        </div>
      )}

      {/* 403 — Inactive, no permission */}
      {!loading && errorStatus === 403 && (
        <div className="animate-fade-in mt-16 flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-foreground">
            This topic is no longer active.
          </h2>
          <p className="max-w-sm text-[14px] text-muted-foreground">
            Inactive topics are only visible to administrators.
          </p>
          <Button asChild variant="outline" className="cursor-pointer mt-2">
            <Link href="/topics">Back to topics</Link>
          </Button>
        </div>
      )}

      {/* Other error */}
      {!loading &&
        errorStatus !== 404 &&
        errorStatus !== 403 &&
        errorMessage && (
          <div className="animate-fade-in mt-16 flex flex-col items-center gap-4 text-center">
            <h2 className="font-display text-2xl font-medium tracking-tight text-foreground">
              Could not load this topic.
            </h2>
            <p className="max-w-sm text-[13px] text-muted-foreground">
              {errorMessage}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTopic}
              className="cursor-pointer mt-2"
            >
              Try again
            </Button>
          </div>
        )}

      {/* Loaded */}
      {!loading && topic && (
        <article className="animate-fade-in mt-6">
          {/* Title block */}
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-[44px] leading-[1.05] font-medium tracking-tight text-foreground sm:text-[56px]">
              {topic.name}
              <span className="text-primary">.</span>
            </h1>
            <code className="text-eyebrow font-mono text-muted-foreground/70">
              {topic.slug}
            </code>
          </div>

          <div className="rule-gold mt-6" />

          {/* Metadata strip */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <TopicStatusBadge active={topic.is_active} />

            <span className="text-muted-foreground/30">·</span>

            <span className="text-eyebrow tabular text-muted-foreground">
              <span className="text-foreground/80">{topic.question_count}</span>{" "}
              {topic.question_count === 1 ? "question" : "questions"}
            </span>

            <span className="text-muted-foreground/30">·</span>

            <span className="text-eyebrow tabular text-muted-foreground/70">
              Added {formatDate(topic.created_at)}
            </span>

            {topic.updated_at !== topic.created_at && (
              <>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-eyebrow tabular text-muted-foreground/70">
                  Updated {formatDate(topic.updated_at)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="mt-10 max-w-2xl">
            {topic.description ? (
              <p className="text-[15px] leading-relaxed text-foreground/90">
                {topic.description}
              </p>
            ) : (
              <p className="font-display-italic text-[14px] text-muted-foreground/60">
                No description provided.
              </p>
            )}
          </div>

          {/* Admin actions */}
          {isAdmin && (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border/60 pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormOpen(true)}
                className="cursor-pointer"
              >
                <HugeiconsIcon
                  icon={Edit02Icon}
                  size={14}
                  strokeWidth={1.6}
                />
                Edit
              </Button>

              {topic.is_active ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeactivateOpen(true)}
                  className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <HugeiconsIcon
                    icon={UnavailableIcon}
                    size={14}
                    strokeWidth={1.6}
                  />
                  Deactivate
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReactivate}
                  className="cursor-pointer text-primary hover:bg-primary/10 hover:text-primary"
                >
                  <HugeiconsIcon
                    icon={RefreshIcon}
                    size={14}
                    strokeWidth={1.6}
                  />
                  Reactivate
                </Button>
              )}
            </div>
          )}

          {/* Footer placeholder for Phase 4 */}
          <div className="mt-16 flex items-baseline gap-3">
            <span className="font-display-italic tabular text-sm text-primary/70">
              III.
            </span>
            <span className="text-eyebrow text-muted-foreground/60">
              Questions in this topic
            </span>
            <span className="rule-gold flex-1" />
          </div>
          <p className="mt-4 font-display-italic text-[14px] text-muted-foreground/60">
            Coming soon.
          </p>

          {/* Dialogs */}
          <TopicFormDialog
            mode="edit"
            open={formOpen}
            topic={topic}
            onOpenChange={setFormOpen}
            onSuccess={handleSaved}
          />

          <DeactivateConfirm
            open={deactivateOpen}
            topic={topic}
            onOpenChange={setDeactivateOpen}
            onSuccess={handleDeactivated}
          />
        </article>
      )}
    </div>
  )
}
