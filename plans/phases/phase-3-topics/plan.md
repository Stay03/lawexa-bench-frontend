# Phase 3: Topics

**Status:** Complete (synced with API ref update)
**Depends on:** Phase 1 (auth, API client), Phase 2 (app shell)
**Unlocks:** Phase 4 (questions list — needs topic filter), Phase 5 (question form — needs `<TopicSelect>`)

---

## Backend Contract — Verified Understanding

### Topic Object
```json
{
  "id": "uuid",
  "name": "Constitutional Law",
  "slug": "constitutional_law",   // server-generated from name
  "description": null,             // string | null
  "is_active": true,
  "question_count": 24,            // count of non-deleted questions, all statuses
  "created_at": "ISO timestamp",
  "updated_at": "ISO timestamp"
}
```

### Endpoints

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| `GET` | `/api/topics` | **None** (public) | — | `Topic[]` sorted alphabetically. Active topics only. |
| `GET` | `/api/topics?include_inactive=true` | **Admin+** (403 otherwise) | — | `Topic[]` including inactive. |
| `GET` | `/api/topics/{id}` | None for active; **Admin+** for inactive | — | Single `Topic`. 404 if unknown. |
| `POST` | `/api/topics` | **Admin+** | `{ name, description? }` | `201` + `Topic` |
| `PATCH` | `/api/topics/{id}` | **Admin+** | Partial: `{ name?, description?, is_active? }` | `200` + `Topic` |

### Critical Behaviors

1. **Slug is auto-generated** from `name` server-side. Frontend never sends `slug`. Display as read-only metadata (mono fits the editorial aesthetic).
2. **Deactivation can fail with `400`** if any approved questions reference the topic. The error message is human-readable in `detail` — surface it verbatim.
3. **No DELETE endpoint.** Topics are soft-managed via `is_active`. No hard deletion.
4. **No pagination, no search params.** Single array response. Topics are bounded (~10–50 realistic). Client-side filter is fine.
5. **`question_count` is included** on every Topic object — covers all non-deleted questions across all statuses.
6. **Reactivation is supported.** Admins can list inactive topics via `?include_inactive=true`, then `PATCH { is_active: true }` to restore.
7. **Topics are referenced by `slug`** when filtering questions (`?topic=constitutional_law`). Detail page URL uses `id` (UUID) since the get-by-id endpoint takes UUID.

### Permissions Matrix

| Role | List active | List incl. inactive | View detail | Create | Edit | Deactivate | Reactivate |
|------|-------------|--------------------|-----|--------|------|------------|------------|
| (anonymous) | ✓ | — | active only | — | — | — | — |
| `researcher` | ✓ | — | active only | — | — | — | — |
| `admin` | ✓ | ✓ | any | ✓ | ✓ | ✓ | ✓ |
| `super_admin` | ✓ | ✓ | any | ✓ | ✓ | ✓ | ✓ |

---

## Aesthetic Direction

Continuing **Editorial Legal Gravitas** from Phase 2:
- Topics displayed as a typographic index — like the contents page of a legal reference work
- Topic name in serif (Fraunces), slug in mono as understated metadata
- Hair-thin gold rules between rows
- No card-clutter — clean horizontal rows with generous spacing
- Status as a small chip (Active = subtle gold dot; Inactive = muted)
- Section markers continue the `I.` / `II.` italic-serif numbering

---

## Files to Create / Modify

### API layer
| File | Action | Purpose |
|------|--------|---------|
| `lib/api/types.ts` | Modify | Add `Topic` interface + `TopicCreate` / `TopicUpdate` payload types |
| `lib/api/endpoints/topics.ts` | Create | `listTopics()`, `createTopic()`, `updateTopic()` |

### Routes
| File | Action | Purpose |
|------|--------|---------|
| `app/(dashboard)/topics/page.tsx` | Create | Topics list page |
| `app/(dashboard)/topics/[id]/page.tsx` | Create | Topic detail page (added in API-sync update) |

### Components
| File | Action | Purpose |
|------|--------|---------|
| `components/topics/topic-list.tsx` | Create | Renders the list of topic rows |
| `components/topics/topic-row.tsx` | Create | Single topic row with admin actions |
| `components/topics/topic-form-dialog.tsx` | Create | Create/edit dialog (shared form) |
| `components/topics/deactivate-confirm.tsx` | Create | Confirmation alert-dialog with 400-error handling |
| `components/topics/topic-status-badge.tsx` | Create | Active/Inactive chip |
| `components/ui/dialog.tsx` | Add (shadcn) | For form modal |
| `components/ui/alert-dialog.tsx` | Add (shadcn) | For deactivation confirmation |
| `components/ui/input.tsx` | Add (shadcn) | Form input |
| `components/ui/textarea.tsx` | Add (shadcn) | Description field |
| `components/ui/label.tsx` | Add (shadcn) | Form labels |
| `components/ui/badge.tsx` | Add (shadcn) | Status chips (also useful in later phases) |

### Navigation
| File | Action | Purpose |
|------|--------|---------|
| `components/layout/nav-config.ts` | (already wired) | Topics route already in sidebar from Phase 2 |

---

## Implementation Steps (in order)

### 1. Foundations
1. Install shadcn components: `dialog`, `alert-dialog`, `input`, `textarea`, `label`, `badge`
2. Add `Topic`, `TopicCreatePayload`, `TopicUpdatePayload` to `lib/api/types.ts`
3. Create `lib/api/endpoints/topics.ts` with three functions

### 2. List page (read-only first)
4. Create `app/(dashboard)/topics/page.tsx` — client component, fetches on mount with `useEffect`
5. Loading state: 4-row skeleton
6. Error state: friendly message + retry button
7. Empty state: "No topics yet" with subtle icon
8. Render rows in editorial style — name (serif) + slug (mono) + description + status badge
9. Editorial header: `Section II.` marker + "Topics" + count + date

### 3. Admin actions
10. "New Topic" button in the page header (only renders if `isAdmin` from `useAuth`)
11. Create dialog: name (required) + description (optional textarea)
12. On submit: optimistic UI update on success, error inline if 422
13. Edit action: per-row "Edit" button (admin only) opens same dialog prefilled
14. Deactivate action: per-row "Deactivate" opens alert-dialog
15. Alert-dialog wording warns about irreversibility from this UI
16. On 400 (approved questions block deactivation): catch and show server's `detail` message in the alert content

### 4. Polish
17. Subtle fade-in stagger on rows
18. Optimistic add: insert new topic into list immediately, sorted by name
19. Optimistic edit: replace in-place
20. Optimistic deactivate: remove from list (since GET only returns active)

### Defer to Phase 5
- `<TopicSelect>` dropdown for question forms — built when actually needed

---

## Edge Cases & Validation

| Case | UX |
|------|----|
| Name empty / whitespace | Disable submit; inline "Name is required" if user blurs |
| Name too short (< 2 chars) | Inline warning |
| Description > 500 chars | Inline character count, warn |
| Network error on fetch | Error state with retry |
| 401 mid-session | Already handled globally (redirect to login) |
| 403 (researcher hits create) | Shouldn't happen — UI hides actions. If it does, toast the error. |
| 422 on submit (server validation) | Map field errors into the form |
| 400 on deactivate | Show the server's `detail` directly in alert dialog (it's already human-readable: e.g., "Cannot deactivate — 3 approved questions reference this topic.") |
| Concurrent edit | Topic API doesn't enforce optimistic concurrency (no `updated_at` required on PATCH per docs) — last write wins. Don't surface anything. |

---

## Verification Checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] List loads, sorted alphabetically
- [ ] Empty state shows when no topics
- [ ] Loading skeleton appears briefly
- [ ] Error state appears when API down
- [ ] Researcher sees no Create/Edit/Deactivate buttons
- [ ] Admin can create a new topic; appears in list immediately
- [ ] Admin can edit name/description; row updates in place
- [ ] Admin deactivates a topic with no questions → row disappears
- [ ] Admin deactivates a topic with approved questions → 400 surfaced clearly
- [ ] Slug is displayed read-only, never editable
- [ ] Both light and dark themes look correct

---

## Out of Scope (this phase)

- ~~Reactivating inactive topics (no API support documented)~~ → **Now supported** via `?include_inactive=true` + `PATCH { is_active: true }`
- ~~Showing question counts per topic (no API support; deferred to Phase 9 stats)~~ → **Now shown** via `question_count` field on Topic
- Bulk operations (not in API)
- Topic search/filter (small list, defer until needed)
- Per-topic stats breakdown on detail page (`/api/stats/topics/{id}`) → Phase 9
- Listing questions in a topic on detail page → Phase 4 (placeholder shown)
- Reusable `<TopicSelect>` component (Phase 5 will build it with full context)
