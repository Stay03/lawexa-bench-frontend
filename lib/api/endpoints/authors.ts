import { apiFetch } from "@/lib/api/client"
import type { Author } from "@/lib/api/types"

export function listAuthors(): Promise<Author[]> {
  return apiFetch<Author[]>("/researchers/authors")
}
