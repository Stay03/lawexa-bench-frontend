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
