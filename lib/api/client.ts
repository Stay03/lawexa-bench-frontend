import { API_BASE_URL } from "@/lib/config"
import {
  ApiError,
  ConflictError,
  UnauthorizedError,
  ValidationError,
} from "./errors"

const TOKEN_KEY = "bench_token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
  document.cookie = `${TOKEN_KEY}=${token};path=/;max-age=${90 * 24 * 60 * 60};samesite=lax`
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  document.cookie = `${TOKEN_KEY}=;path=/;max-age=0`
}

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown
  noAuth?: boolean
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, noAuth, headers: customHeaders, ...rest } = options

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((customHeaders as Record<string, string>) || {}),
  }

  if (!noAuth) {
    const token = getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    const message =
      typeof data?.detail === "string"
        ? data.detail
        : "An unexpected error occurred"

    switch (response.status) {
      case 401: {
        clearToken()
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        throw new UnauthorizedError(message)
      }
      case 409:
        throw new ConflictError(message)
      case 422: {
        const fields = Array.isArray(data?.detail) ? data.detail : []
        throw new ValidationError(message, fields)
      }
      default:
        throw new ApiError(response.status, message, data?.detail)
    }
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}
