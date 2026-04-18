import { apiFetch } from "@/lib/api/client"
import type { LoginResponse, User } from "@/lib/api/types"

export function login(lawexaToken: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: { lawexa_token: lawexaToken },
    noAuth: true,
  })
}

export function getMe(): Promise<User> {
  return apiFetch<User>("/auth/me")
}
