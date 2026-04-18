"use client"

import { use, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ContaminationBadge } from "@/components/questions/contamination-badge"
import { DifficultyMeter } from "@/components/questions/difficulty-meter"
import { KeyPointsDisplay } from "@/components/questions/key-points-display"
import { McqOptionsDisplay } from "@/components/questions/mcq-options-display"
import { ReferenceAnswerDisplay } from "@/components/questions/reference-answer-display"
import { StatusBadge } from "@/components/questions/status-badge"
import {
  COGNITIVE_LEVEL_LABEL,
  formatDateShort,
  formatRelativeTime,
  LEGAL_TRADITION_LABEL,
  QUESTION_TYPE_LABEL,
  SOURCE_TYPE_LABEL,
} from "@/lib/format/question-enums"
import { getQuestion } from "@/lib/api/endpoints/questions"
import { ApiError } from "@/lib/api/errors"
import type { Question } from "@/lib/api/types"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function QuestionDetailPage({ params }: PageProps) {
  const { id } = use(params)

  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorStatus, setErrorStatus] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchQuestion = useCallback(async () => {
    setLoading(true)
    setErrorStatus(null)
    setErrorMessage(null)
    try {
      const data = await getQuestion(id)
      setQuestion(data)
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
    fetchQuestion()
  }, [fetchQuestion])

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10 lg:px-10 lg:py-14">
      {/* Eyebrow row */}
      <div className="animate-fade-in flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-display-italic tabular text-sm text-primary/70">
            I.
          </span>
          <span className="text-eyebrow text-muted-foreground/70">
            Question
          </span>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <Link href="/questions">
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={14}
              strokeWidth={1.8}
            />
            All questions
          </Link>
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="animate-fade-in mt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {/* 404 */}
      {!loading && errorStatus === 404 && (
        <div className="animate-fade-in mt-16 flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-foreground">
            Question not found.
          </h2>
          <p className="max-w-sm text-[14px] text-muted-foreground">
            This question may have been removed, or the link is incorrect.
          </p>
          <Button asChild variant="outline" className="cursor-pointer mt-2">
            <Link href="/questions">Back to questions</Link>
          </Button>
        </div>
      )}

      {/* Other error */}
      {!loading && errorStatus !== 404 && errorMessage && (
        <div className="animate-fade-in mt-16 flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-2xl font-medium tracking-tight text-foreground">
            Could not load this question.
          </h2>
          <p className="max-w-sm text-[13px] text-muted-foreground">
            {errorMessage}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchQuestion}
            className="cursor-pointer mt-2"
          >
            Try again
          </Button>
        </div>
      )}

      {/* Loaded */}
      {!loading && question && (
        <article className="animate-fade-in mt-6">
          {/* Topic chip */}
          <div className="text-eyebrow text-primary">
            {question.topic_name || "—"}
          </div>

          {/* Title block — the question text itself */}
          <h1 className="font-display mt-3 text-[30px] leading-[1.18] font-medium tracking-tight text-foreground sm:text-[38px]">
            {question.text}
          </h1>

          <div className="rule-gold mt-6" />

          {/* Metadata strip */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5">
            <StatusBadge status={question.status} size="md" />
            <span className="text-muted-foreground/30">·</span>
            <span className="text-eyebrow text-muted-foreground">
              {QUESTION_TYPE_LABEL[question.question_type]}
            </span>
            <span className="text-muted-foreground/30">·</span>
            <DifficultyMeter difficulty={question.difficulty} />
            <span className="text-muted-foreground/30">·</span>
            <span className="text-eyebrow text-muted-foreground">
              {COGNITIVE_LEVEL_LABEL[question.cognitive_level]}
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-eyebrow text-muted-foreground">
              {LEGAL_TRADITION_LABEL[question.legal_tradition]}
            </span>
            <span className="text-muted-foreground/30">·</span>
            <ContaminationBadge risk={question.contamination_risk} />
          </div>

          {/* Source */}
          <div className="mt-8 flex flex-col gap-1.5">
            <span className="text-eyebrow text-muted-foreground/70">
              Source
            </span>
            <p className="font-display-italic text-[15px] leading-relaxed text-foreground/90">
              {question.source}
            </p>
            <span className="text-eyebrow-sm text-muted-foreground/60">
              {SOURCE_TYPE_LABEL[question.source_type]}
            </span>
          </div>

          {/* Body — branches by question type */}
          <div className="mt-12">
            {question.question_type === "mcq" ? (
              <McqOptionsDisplay
                options={question.mcq_options}
                isMultiSelect={question.is_multi_select}
              />
            ) : (
              <div className="flex flex-col gap-10">
                {question.reference_answer && (
                  <ReferenceAnswerDisplay
                    answer={question.reference_answer}
                  />
                )}
                {question.key_points.length > 0 && (
                  <KeyPointsDisplay points={question.key_points} />
                )}
              </div>
            )}
          </div>

          {/* Footer — author + timestamps */}
          <div className="mt-16 border-t border-border/60 pt-6">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-eyebrow-sm text-muted-foreground/70">
              <span>
                <span className="text-muted-foreground/50">Authored by</span>{" "}
                <span className="text-foreground">
                  {question.author_name}
                </span>
              </span>
              <span className="text-muted-foreground/30">·</span>
              <span className="tabular">
                <span className="text-muted-foreground/50">Added</span>{" "}
                {formatDateShort(question.created_at)}
              </span>
              {question.updated_at !== question.created_at && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="tabular">
                    <span className="text-muted-foreground/50">Updated</span>{" "}
                    {formatRelativeTime(question.updated_at)}
                  </span>
                </>
              )}
              {question.approved_version > 0 && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="tabular">
                    <span className="text-muted-foreground/50">Version</span>{" "}
                    {question.approved_version}
                  </span>
                </>
              )}
            </div>
          </div>
        </article>
      )}
    </div>
  )
}
