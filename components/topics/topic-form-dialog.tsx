"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createTopic, updateTopic } from "@/lib/api/endpoints/topics"
import { ApiError, ValidationError } from "@/lib/api/errors"
import type { Topic } from "@/lib/api/types"
import { cn } from "@/lib/utils"

interface TopicFormDialogProps {
  mode: "create" | "edit"
  open: boolean
  topic?: Topic
  onOpenChange: (open: boolean) => void
  onSuccess: (topic: Topic) => void
}

const MAX_DESC = 500

export function TopicFormDialog({
  mode,
  open,
  topic,
  onOpenChange,
  onSuccess,
}: TopicFormDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    description?: string
    form?: string
  }>({})

  useEffect(() => {
    if (open) {
      setName(topic?.name ?? "")
      setDescription(topic?.description ?? "")
      setErrors({})
    }
  }, [open, topic])

  const trimmedName = name.trim()
  const isValid =
    trimmedName.length >= 2 && description.length <= MAX_DESC && !submitting

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return

    setSubmitting(true)
    setErrors({})

    try {
      const payload = {
        name: trimmedName,
        description: description.trim() || null,
      }

      const result =
        mode === "create"
          ? await createTopic(payload)
          : await updateTopic(topic!.id, payload)

      onSuccess(result)
      onOpenChange(false)
    } catch (err) {
      if (err instanceof ValidationError) {
        const fieldErrors: typeof errors = {}
        for (const f of err.fields) {
          const field = f.loc[f.loc.length - 1]
          if (field === "name") fieldErrors.name = f.msg
          else if (field === "description") fieldErrors.description = f.msg
        }
        setErrors(
          Object.keys(fieldErrors).length > 0
            ? fieldErrors
            : { form: err.message },
        )
      } else if (err instanceof ApiError) {
        setErrors({ form: err.message })
      } else {
        setErrors({ form: "An unexpected error occurred." })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const isEdit = mode === "edit"
  const charCount = description.length
  const charOver = charCount > MAX_DESC

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="text-eyebrow mb-2 text-primary">
            {isEdit ? "Edit topic" : "New topic"}
          </div>
          <DialogTitle className="font-display text-2xl font-medium tracking-tight">
            {isEdit ? topic?.name : "Add a practice area"}
          </DialogTitle>
          <DialogDescription className="text-[13px] text-muted-foreground">
            {isEdit
              ? "Update the topic name or description. The slug stays the same."
              : "Topics organize questions by legal practice area. The slug is generated from the name."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="topic-name" className="text-eyebrow-sm">
              Name
            </Label>
            <Input
              id="topic-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Constitutional Law"
              autoFocus
              maxLength={120}
              aria-invalid={!!errors.name}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="topic-description" className="text-eyebrow-sm">
                Description
                <span className="ml-2 normal-case tracking-normal text-muted-foreground/60">
                  (optional)
                </span>
              </Label>
              <span
                className={cn(
                  "text-eyebrow-sm tabular text-muted-foreground/60",
                  charOver && "text-destructive",
                )}
              >
                {charCount} / {MAX_DESC}
              </span>
            </div>
            <Textarea
              id="topic-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of this practice area."
              rows={3}
              aria-invalid={!!errors.description || charOver}
              className={cn(
                "resize-none",
                (errors.description || charOver) && "border-destructive",
              )}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          {errors.form && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              {errors.form}
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="cursor-pointer"
            >
              {submitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save changes"
                  : "Create topic"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
