import type {
  CognitiveLevel,
  ContaminationRisk,
  Difficulty,
  KeyPointCategory,
  LegalTradition,
  QuestionStatus,
  QuestionType,
  SourceType,
} from "@/lib/api/types"

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  mcq: "Multiple Choice",
  short_answer: "Short Answer",
  long_form_analysis: "Long Form",
  case_analysis: "Case Analysis",
}

export const COGNITIVE_LEVEL_LABEL: Record<CognitiveLevel, string> = {
  memorization: "Recall",
  understanding: "Understanding",
  application: "Application",
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  undergraduate: "Undergraduate",
  law_school: "Law School",
  practitioner: "Practitioner",
}

export const DIFFICULTY_LEVEL: Record<Difficulty, 1 | 2 | 3> = {
  undergraduate: 1,
  law_school: 2,
  practitioner: 3,
}

export const LEGAL_TRADITION_LABEL: Record<LegalTradition, string> = {
  common_law: "Common Law",
  customary_law: "Customary Law",
  sharia: "Sharia",
  statutory: "Statutory",
}

export const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  original: "Original",
  bar_exam: "Bar Exam",
  university_exam: "University Exam",
  textbook: "Textbook",
  case_law: "Case Law",
}

export const CONTAMINATION_LABEL: Record<ContaminationRisk, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

export const STATUS_LABEL: Record<QuestionStatus, string> = {
  draft: "Draft",
  in_review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
}

export const KEY_POINT_CATEGORY_LABEL: Record<KeyPointCategory, string> = {
  accuracy: "Accuracy",
  reasoning: "Reasoning",
  completeness: "Completeness",
  relevance: "Relevance",
  clarity: "Clarity",
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diffSec = Math.max(1, Math.floor((now - then) / 1000))

  if (diffSec < 60) return "just now"
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 30) return `${diffDay}d ago`
  const diffMonth = Math.floor(diffDay / 30)
  if (diffMonth < 12) return `${diffMonth}mo ago`
  return `${Math.floor(diffMonth / 12)}y ago`
}

export function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
}
