"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { updateTopic } from "@/lib/api/endpoints/topics"
import { ApiError } from "@/lib/api/errors"
import type { Topic } from "@/lib/api/types"

interface DeactivateConfirmProps {
  open: boolean
  topic: Topic | null
  onOpenChange: (open: boolean) => void
  onSuccess: (topic: Topic) => void
}

export function DeactivateConfirm({
  open,
  topic,
  onOpenChange,
  onSuccess,
}: DeactivateConfirmProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    if (!topic) return

    setSubmitting(true)
    setError(null)

    try {
      const updated = await updateTopic(topic.id, { is_active: false })
      onSuccess(updated)
      onOpenChange(false)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to deactivate. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) setError(null)
    onOpenChange(next)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="text-eyebrow mb-2 text-muted-foreground">
            Confirm deactivation
          </div>
          <AlertDialogTitle className="font-display text-xl font-medium tracking-tight">
            Deactivate{" "}
            <span className="font-display-italic">
              &ldquo;{topic?.name}&rdquo;
            </span>
            ?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[13px] leading-relaxed text-muted-foreground">
            This topic will be hidden from researchers and removed from
            selection menus. Existing questions referencing it are unaffected.{" "}
            <span className="text-foreground/70">
              You can reactivate it later from the inactive list.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting} className="cursor-pointer">
            Keep active
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
            disabled={submitting}
            className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {submitting ? "Deactivating..." : "Deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
