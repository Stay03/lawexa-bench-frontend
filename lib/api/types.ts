export type UserRole = "researcher" | "admin" | "super_admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  bio: string | null
  is_active: boolean
  questions_authored: number
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

export interface Topic {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  question_count: number
  created_at: string
  updated_at: string
}

export interface TopicCreatePayload {
  name: string
  description?: string | null
}

export interface TopicUpdatePayload {
  name?: string
  description?: string | null
  is_active?: boolean
}

// Question enums
export type LegalTradition =
  | "common_law"
  | "customary_law"
  | "sharia"
  | "statutory"

export type QuestionType =
  | "mcq"
  | "short_answer"
  | "long_form_analysis"
  | "case_analysis"

export type CognitiveLevel = "memorization" | "understanding" | "application"

export type Difficulty = "undergraduate" | "law_school" | "practitioner"

export type SourceType =
  | "original"
  | "bar_exam"
  | "university_exam"
  | "textbook"
  | "case_law"

export type ContaminationRisk = "low" | "medium" | "high"

export type QuestionStatus = "draft" | "in_review" | "approved" | "rejected"

export type KeyPointCategory =
  | "accuracy"
  | "reasoning"
  | "completeness"
  | "relevance"
  | "clarity"

// Question shape
export interface McqOption {
  id: string
  text: string
  is_correct: boolean
}

export interface ReferenceAnswer {
  id: string
  answer_text: string
  author_id: string
  author_name: string
  created_at: string
  updated_at: string
}

export interface KeyPoint {
  id: string
  point_text: string
  weight: number
  category: KeyPointCategory
}

export interface Question {
  id: string
  text: string
  topic_id: string
  topic_name: string
  legal_tradition: LegalTradition
  question_type: QuestionType
  cognitive_level: CognitiveLevel
  difficulty: Difficulty
  source: string
  source_type: SourceType
  contamination_risk: ContaminationRisk
  is_multi_select: boolean
  status: QuestionStatus
  author_id: string
  author_name: string
  approved_version: number
  claimed_by: string | null
  claimed_by_name: string | null
  claimed_at: string | null
  created_at: string
  updated_at: string
  mcq_options: McqOption[]
  reference_answer: ReferenceAnswer | null
  key_points: KeyPoint[]
}

export type QuestionOrderBy =
  | "created_at"
  | "-created_at"
  | "updated_at"
  | "-updated_at"
  | "difficulty"
  | "-difficulty"

export interface QuestionListParams {
  q?: string
  topic?: string
  question_type?: QuestionType
  cognitive_level?: CognitiveLevel
  difficulty?: Difficulty
  legal_tradition?: LegalTradition
  contamination_risk?: ContaminationRisk
  status?: QuestionStatus
  author_id?: string
  order_by?: QuestionOrderBy
  page?: number
  page_size?: number
}

// Lightweight author for filter dropdowns
export interface Author {
  id: string
  name: string
}
