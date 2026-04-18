import { apiFetch } from "@/lib/api/client"
import type {
  Topic,
  TopicCreatePayload,
  TopicUpdatePayload,
} from "@/lib/api/types"

export function listTopics(
  opts: { includeInactive?: boolean } = {},
): Promise<Topic[]> {
  if (opts.includeInactive) {
    return apiFetch<Topic[]>("/topics?include_inactive=true")
  }
  return apiFetch<Topic[]>("/topics", { noAuth: true })
}

export function getTopic(id: string): Promise<Topic> {
  return apiFetch<Topic>(`/topics/${id}`)
}

export function createTopic(payload: TopicCreatePayload): Promise<Topic> {
  return apiFetch<Topic>("/topics", {
    method: "POST",
    body: payload,
  })
}

export function updateTopic(
  id: string,
  payload: TopicUpdatePayload,
): Promise<Topic> {
  return apiFetch<Topic>(`/topics/${id}`, {
    method: "PATCH",
    body: payload,
  })
}
