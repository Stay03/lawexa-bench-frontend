"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type {
  CognitiveLevel,
  ContaminationRisk,
  Difficulty,
  LegalTradition,
  QuestionListParams,
  QuestionOrderBy,
  QuestionStatus,
  QuestionType,
} from "@/lib/api/types"

const QUESTION_TYPES: QuestionType[] = [
  "mcq",
  "short_answer",
  "long_form_analysis",
  "case_analysis",
]
const COGNITIVE_LEVELS: CognitiveLevel[] = [
  "memorization",
  "understanding",
  "application",
]
const DIFFICULTIES: Difficulty[] = [
  "undergraduate",
  "law_school",
  "practitioner",
]
const LEGAL_TRADITIONS: LegalTradition[] = [
  "common_law",
  "customary_law",
  "sharia",
  "statutory",
]
const CONTAMINATION_RISKS: ContaminationRisk[] = ["low", "medium", "high"]
const STATUSES: QuestionStatus[] = [
  "draft",
  "in_review",
  "approved",
  "rejected",
]
const ORDER_BYS: QuestionOrderBy[] = [
  "created_at",
  "-created_at",
  "updated_at",
  "-updated_at",
  "difficulty",
  "-difficulty",
]

export const DEFAULT_ORDER_BY: QuestionOrderBy = "-created_at"
export const DEFAULT_PAGE_SIZE = 20

function readEnum<T extends string>(
  value: string | null,
  allowed: readonly T[],
): T | undefined {
  if (value && (allowed as readonly string[]).includes(value)) {
    return value as T
  }
  return undefined
}

function readInt(value: string | null, fallback: number, min: number): number {
  const n = value ? parseInt(value, 10) : NaN
  return Number.isFinite(n) && n >= min ? n : fallback
}

export interface QuestionFiltersState extends QuestionListParams {
  page: number
  page_size: number
  order_by: QuestionOrderBy
}

const RESETS_PAGE: (keyof QuestionListParams)[] = [
  "q",
  "topic",
  "question_type",
  "cognitive_level",
  "difficulty",
  "legal_tradition",
  "contamination_risk",
  "status",
  "author_id",
  "order_by",
  "page_size",
]

export function useQuestionFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filters: QuestionFiltersState = useMemo(() => {
    return {
      q: searchParams.get("q") || undefined,
      topic: searchParams.get("topic") || undefined,
      question_type: readEnum(
        searchParams.get("question_type"),
        QUESTION_TYPES,
      ),
      cognitive_level: readEnum(
        searchParams.get("cognitive_level"),
        COGNITIVE_LEVELS,
      ),
      difficulty: readEnum(searchParams.get("difficulty"), DIFFICULTIES),
      legal_tradition: readEnum(
        searchParams.get("legal_tradition"),
        LEGAL_TRADITIONS,
      ),
      contamination_risk: readEnum(
        searchParams.get("contamination_risk"),
        CONTAMINATION_RISKS,
      ),
      status: readEnum(searchParams.get("status"), STATUSES),
      author_id: searchParams.get("author_id") || undefined,
      order_by:
        readEnum(searchParams.get("order_by"), ORDER_BYS) ?? DEFAULT_ORDER_BY,
      page: readInt(searchParams.get("page"), 1, 1),
      page_size: readInt(
        searchParams.get("page_size"),
        DEFAULT_PAGE_SIZE,
        1,
      ),
    }
  }, [searchParams])

  const activeCount = useMemo(() => {
    let count = 0
    if (filters.q) count++
    if (filters.topic) count++
    if (filters.question_type) count++
    if (filters.cognitive_level) count++
    if (filters.difficulty) count++
    if (filters.legal_tradition) count++
    if (filters.contamination_risk) count++
    if (filters.status) count++
    if (filters.author_id) count++
    return count
  }, [filters])

  const apply = useCallback(
    (patch: Partial<QuestionListParams>, replace = true) => {
      const next = new URLSearchParams(searchParams.toString())

      const resetsPage = Object.keys(patch).some((key) =>
        RESETS_PAGE.includes(key as keyof QuestionListParams),
      )

      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === null || value === "") {
          next.delete(key)
        } else {
          next.set(key, String(value))
        }
      }

      if (resetsPage && !("page" in patch)) {
        next.delete("page")
      }

      const qs = next.toString()
      const url = qs ? `${pathname}?${qs}` : pathname

      if (replace) {
        router.replace(url, { scroll: false })
      } else {
        router.push(url, { scroll: false })
      }
    },
    [pathname, router, searchParams],
  )

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false })
  }, [pathname, router])

  return { filters, activeCount, apply, reset }
}
