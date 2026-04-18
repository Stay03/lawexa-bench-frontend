export type UserRole = "researcher" | "admin" | "super_admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  bio: string | null
  is_active: boolean
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
