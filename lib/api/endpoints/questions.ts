import { apiFetch } from "@/lib/api/client"
import type {
  PaginatedResponse,
  Question,
  QuestionListParams,
} from "@/lib/api/types"

function buildQuery(params: QuestionListParams): string {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue
    searchParams.set(key, String(value))
  }
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ""
}

export function listQuestions(
  params: QuestionListParams = {},
): Promise<PaginatedResponse<Question>> {
  return apiFetch<PaginatedResponse<Question>>(
    `/questions${buildQuery(params)}`,
  )
}

export function getQuestion(id: string): Promise<Question> {
  return apiFetch<Question>(`/questions/${id}`)
}
