"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { ActiveFilterChips } from "@/components/questions/active-filter-chips"
import { FilterSheet } from "@/components/questions/filter-sheet"
import { Pagination } from "@/components/questions/pagination"
import { QuestionList } from "@/components/questions/question-list"
import { SearchInput } from "@/components/questions/search-input"
import { SortMenu } from "@/components/questions/sort-menu"
import { useQuestionFilters } from "@/hooks/use-question-filters"
import { listAuthors } from "@/lib/api/endpoints/authors"
import { listQuestions } from "@/lib/api/endpoints/questions"
import { listTopics } from "@/lib/api/endpoints/topics"
import { ApiError } from "@/lib/api/errors"
import type { Author, Question, Topic } from "@/lib/api/types"

function QuestionsPageContent() {
  const { filters, activeCount, apply, reset } = useQuestionFilters()

  const [questions, setQuestions] = useState<Question[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [topics, setTopics] = useState<Topic[]>([])
  const [authors, setAuthors] = useState<Author[]>([])

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listQuestions(filters)
      setQuestions(data.items)
      setTotal(data.total)
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "An unexpected error occurred.",
      )
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  // Topics and authors are loaded once on mount; failures are non-fatal
  useEffect(() => {
    listTopics().then(setTopics).catch(() => setTopics([]))
    listAuthors().then(setAuthors).catch(() => setAuthors([]))
  }, [])

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 lg:px-10 lg:py-14">
      {/* Editorial header */}
      <div className="animate-fade-in flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="font-display-italic tabular text-sm text-primary/70">
            I.
          </span>
          <span className="text-eyebrow text-muted-foreground/70">
            The bench
          </span>
        </div>

        <div className="mt-2">
          <h1 className="font-display text-[40px] leading-[1.05] font-medium tracking-tight text-foreground sm:text-[48px]">
            Questions.
          </h1>
          <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
            Every question authored on the bench. Filter, search, and inspect
            the body of work taking shape.
          </p>
        </div>

        <div className="rule-gold mt-6" />
      </div>

      {/* Filter bar */}
      <div className="animate-fade-in mt-6 flex flex-wrap items-center gap-3 [animation-delay:120ms]">
        <SearchInput
          value={filters.q}
          onChange={(v) => apply({ q: v })}
        />
        <div className="ml-auto flex items-center gap-2">
          <SortMenu
            value={filters.order_by}
            onChange={(v) => apply({ order_by: v })}
          />
          <FilterSheet
            filters={filters}
            topics={topics}
            authors={authors}
            activeCount={activeCount}
            onApply={(patch) => apply(patch)}
            onReset={reset}
          />
        </div>
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="animate-fade-in mt-3">
          <ActiveFilterChips
            filters={filters}
            topics={topics}
            authors={authors}
            onRemove={(patch) => apply(patch)}
            onClearAll={reset}
          />
        </div>
      )}

      {/* List */}
      <section className="animate-fade-in mt-4 [animation-delay:240ms]">
        <QuestionList
          questions={questions}
          loading={loading}
          error={error}
          hasFilters={activeCount > 0}
          onRetry={fetchQuestions}
          onClearFilters={reset}
        />
      </section>

      {/* Pagination */}
      {!loading && !error && questions.length > 0 && (
        <Pagination
          page={filters.page}
          pageSize={filters.page_size}
          total={total}
          onPageChange={(p) => apply({ page: p })}
          onPageSizeChange={(s) => apply({ page_size: s, page: 1 })}
        />
      )}
    </div>
  )
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={null}>
      <QuestionsPageContent />
    </Suspense>
  )
}
