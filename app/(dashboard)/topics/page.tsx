"use client"

import { useCallback, useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { DeactivateConfirm } from "@/components/topics/deactivate-confirm"
import { TopicFormDialog } from "@/components/topics/topic-form-dialog"
import { TopicList } from "@/components/topics/topic-list"
import { useAuth } from "@/hooks/use-auth"
import { listTopics, updateTopic } from "@/lib/api/endpoints/topics"
import { ApiError } from "@/lib/api/errors"
import type { Topic } from "@/lib/api/types"

function sortByName(topics: Topic[]): Topic[] {
  return [...topics].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  )
}

export default function TopicsPage() {
  const { isAdmin } = useAuth()
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showInactive, setShowInactive] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Topic | undefined>(undefined)
  const [deactivating, setDeactivating] = useState<Topic | null>(null)

  const fetchTopics = useCallback(async (includeInactive: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listTopics({ includeInactive })
      setTopics(sortByName(data))
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "An unexpected error occurred.",
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTopics(showInactive)
  }, [fetchTopics, showInactive])

  function handleNew() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function handleEdit(topic: Topic) {
    setEditing(topic)
    setFormOpen(true)
  }

  function handleDeactivate(topic: Topic) {
    setDeactivating(topic)
  }

  async function handleReactivate(topic: Topic) {
    try {
      const updated = await updateTopic(topic.id, { is_active: true })
      setTopics((prev) =>
        sortByName(prev.map((t) => (t.id === updated.id ? updated : t))),
      )
    } catch (err) {
      console.warn("Reactivation failed", err)
    }
  }

  function handleSaved(saved: Topic) {
    setTopics((prev) => {
      const exists = prev.some((t) => t.id === saved.id)
      const merged = exists
        ? prev.map((t) => (t.id === saved.id ? saved : t))
        : [...prev, saved]
      const filtered = showInactive
        ? merged
        : merged.filter((t) => t.is_active)
      return sortByName(filtered)
    })
  }

  function handleDeactivated(deactivated: Topic) {
    setTopics((prev) => {
      if (showInactive) {
        return sortByName(
          prev.map((t) => (t.id === deactivated.id ? deactivated : t)),
        )
      }
      return prev.filter((t) => t.id !== deactivated.id)
    })
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 lg:px-10 lg:py-14">
      {/* Editorial header */}
      <div className="animate-fade-in flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="font-display-italic tabular text-sm text-primary/70">
            II.
          </span>
          <span className="text-eyebrow text-muted-foreground/70">
            Practice areas
          </span>
        </div>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-[40px] leading-[1.05] font-medium tracking-tight text-foreground sm:text-[48px]">
              Topics.
            </h1>
            <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
              The practice areas that organize the bench. Researchers pick from
              these when authoring questions.
            </p>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2 self-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInactive((v) => !v)}
                className="cursor-pointer text-muted-foreground hover:text-foreground"
              >
                {showInactive ? "Hide inactive" : "Show inactive"}
              </Button>
              <Button onClick={handleNew} className="cursor-pointer">
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  size={14}
                  strokeWidth={2}
                />
                New topic
              </Button>
            </div>
          )}
        </div>

        <div className="rule-gold mt-6" />
      </div>

      {/* List */}
      <section className="animate-fade-in mt-2 [animation-delay:120ms]">
        <TopicList
          topics={topics}
          loading={loading}
          error={error}
          canManage={isAdmin}
          onRetry={() => fetchTopics(showInactive)}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
          onReactivate={handleReactivate}
        />
      </section>

      {/* Footer count */}
      {!loading && topics.length > 0 && (
        <div className="animate-fade-in mt-10 flex items-center gap-3 [animation-delay:240ms]">
          <span className="rule-gold w-12" />
          <span className="text-eyebrow text-muted-foreground/60 tabular">
            {topics.length} {topics.length === 1 ? "topic" : "topics"}
          </span>
        </div>
      )}

      {/* Dialogs */}
      <TopicFormDialog
        mode={editing ? "edit" : "create"}
        open={formOpen}
        topic={editing}
        onOpenChange={setFormOpen}
        onSuccess={handleSaved}
      />

      <DeactivateConfirm
        open={deactivating !== null}
        topic={deactivating}
        onOpenChange={(open) => !open && setDeactivating(null)}
        onSuccess={handleDeactivated}
      />
    </div>
  )
}
