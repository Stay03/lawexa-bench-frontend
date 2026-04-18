# Phase 4: Questions — List & View

**Status:** Not started
**Depends on:** Phase 1 (auth, API client), Phase 2 (app shell), Phase 3 (topics — for the topic filter)
**Unlocks:** Phase 5 (Create/Edit), Phase 6 (Workflow), Phase 7 (Reviews), Phase 8 (Audit Log)

This phase is **read-only**. No create, edit, submit, withdraw, claim, review, or delete actions — those land in Phases 5–7.

---

## Backend Contract — Verified Understanding

### Endpoints

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| `GET` | `/api/questions` | Required (any role) | Paginated. 12 query params (see below). |
| `GET` | `/api/questions/{id}` | Required (any role) | Single `QuestionResponse`. |
| `GET` | `/api/topics` | Public | Used to populate the topic filter dropdown. |
| `GET` | `/api/researchers/authors` | Required (any logged-in user) | Lightweight `[{ id, name }]` for author filter dropdown. Only includes active researchers with ≥1 non-deleted question. |

### List query params (all optional, all combinable)

| Param | Type | Notes |
|-------|------|-------|
| `q` | text | Full-text search |
| `topic` | slug (NOT id) | e.g. `?topic=constitutional_law` |
| `question_type` | enum | `mcq` / `short_answer` / `long_form_analysis` / `case_analysis` |
| `cognitive_level` | enum | `memorization` / `understanding` / `application` |
| `difficulty` | enum | `undergraduate` / `law_school` / `practitioner` |
| `legal_tradition` | enum | `common_law` / `customary_law` / `sharia` / `statutory` |
| `contamination_risk` | enum | `low` / `medium` / `high` |
| `status` | enum | `draft` / `in_review` / `approved` / `rejected` |
| `author_id` | UUID | |
| `order_by` | string | `created_at` / `updated_at` / `difficulty` (prefix `-` for desc) |
| `page` | int ≥ 1 | default 1 |
| `page_size` | int 1–100 | default 20 |

### List response

```json
{
  "items": [ /* QuestionResponse */ ],
  "total": 150,
  "page": 1,
  "page_size": 20
}
```

### `QuestionResponse` shape (full)

```json
{
  "id": "uuid",
  "text": "...",
  "topic_id": "uuid",
  "topic_name": "Constitutional Law",
  "legal_tradition": "statutory",
  "question_type": "long_form_analysis",
  "cognitive_level": "understanding",
  "difficulty": "law_school",
  "source": "Original — Dr. Adekoya",
  "source_type": "original",
  "contamination_risk": "low",
  "is_multi_select": false,
  "status": "draft",
  "author_id": "uuid",
  "author_name": "Dr. Adekoya",
  "approved_version": 0,
  "claimed_by": null,
  "claimed_by_name": null,
  "claimed_at": null,
  "created_at": "...",
  "updated_at": "...",
  "mcq_options": [
    { "id": "uuid", "text": "...", "is_correct": true }
  ],
  "reference_answer": {
    "id": "uuid",
    "answer_text": "...",
    "author_id": "uuid",
    "author_name": "Dr. Adekoya",
    "created_at": "...",
    "updated_at": "..."
  } | null,
  "key_points": [
    { "id": "uuid", "point_text": "...", "weight": 3.0, "category": "accuracy" }
  ]
}
```

### Critical Behaviors

1. **`topic` filter takes the slug, NOT the UUID.** The dropdown picks topics; we send their slug.
2. **`author_id` filter takes UUID** (different from topic).
3. **`order_by` uses leading `-`** for descending (e.g., `-created_at` = newest first).
4. **Contamination risk auto-default** is server-applied — relevant for Phase 5 (creating), not for read.
5. **Claim fields can be `null`** even on `in_review` questions if the claim expired (claims auto-expire after 30 min, checked on every read).
6. **`mcq_options` is empty `[]` for non-MCQ questions** — branch on `question_type`, not on `mcq_options.length`.
7. **`reference_answer` and `key_points` can be empty/null on MCQ** — they're optional for MCQ, required for non-MCQ.
8. **Permissions:** Any authenticated user can read all questions, regardless of status. There's no "only my drafts" restriction at the API level — UI can offer that as a saved filter (e.g., quick-link "My drafts").

---

## Aesthetic Direction

Continue **Editorial Legal Gravitas**:
- Question text in Fraunces serif as the prominent element of each row
- Metadata in eyebrow caps with middle-dot separators
- Status badge with colored dot (gold for approved, amber for in_review, muted for draft, destructive for rejected)
- Hair-thin row separators
- Filter UI: minimal main bar (search, sort, "Filters" trigger) + active-filter chips below + sheet/drawer for full filters
- Detail page: large editorial title-block layout matching the topic detail page (Fraunces title, hairline rule, metadata strip, content sections)

---

## URL as Single Source of Truth

All list state lives in the URL search params. Reasons:
- Filters are bookmarkable and shareable
- Browser back/forward works as expected
- Deep links from emails/Slack work
- Page refresh preserves view

Implementation: a `useQuestionFilters()` hook that reads `useSearchParams()` into a typed object and exposes update functions that call `router.replace(?...)`. Default values applied when params are missing. URL is debounced for the search input (300ms) so typing doesn't flood history.

---

## Filter UI Strategy

With **9 filter dimensions**, putting them all inline is cluttered. Strategy:

- **Top bar (always visible):**
  - Search input (left, debounced)
  - Sort dropdown (right): created/updated/difficulty × asc/desc
  - "Filters" button (right) with count badge if any active → opens **sheet/drawer** with all 8 filter selects
- **Active filter chips** below the bar, each removable with `×`. "Clear all" link if 2+ active.
- **Pagination** at the bottom: prev / page X of Y / next + total count + page-size selector

This is clean, scalable, and works well on mobile (sheet becomes full-screen).

---

## Files to Create / Modify

### API layer
| File | Action | Purpose |
|------|--------|---------|
| `lib/api/types.ts` | Modify | Add all enum union types, `Question`, `McqOption`, `ReferenceAnswer`, `KeyPoint`, `Author`, `QuestionListParams` |
| `lib/api/endpoints/questions.ts` | Create | `listQuestions(params)`, `getQuestion(id)` |
| `lib/api/endpoints/authors.ts` | Create | `listAuthors()` |

### Routes
| File | Action | Purpose |
|------|--------|---------|
| `app/(dashboard)/questions/page.tsx` | Create | Questions list page |
| `app/(dashboard)/questions/[id]/page.tsx` | Create | Question detail page |

### Hooks
| File | Action | Purpose |
|------|--------|---------|
| `hooks/use-question-filters.ts` | Create | URL-backed filter state with typed reads/writes |

### Components — shared formatting
| File | Action | Purpose |
|------|--------|---------|
| `lib/format/question-enums.ts` | Create | Humanize enum labels (`long_form_analysis` → "Long Form") + helpers for status/difficulty styling |

### Components — questions
| File | Action | Purpose |
|------|--------|---------|
| `components/questions/status-badge.tsx` | Create | Reusable across list, detail, dashboard, review queue |
| `components/questions/difficulty-meter.tsx` | Create | Small 1/2/3-dot indicator for undergrad/law-school/practitioner |
| `components/questions/contamination-badge.tsx` | Create | Subtle low/medium/high indicator |
| `components/questions/question-row.tsx` | Create | List row: text + metadata + status |
| `components/questions/question-list.tsx` | Create | Wraps rows with loading/empty/error states |
| `components/questions/filter-sheet.tsx` | Create | Slide-over with all 8 filter selects |
| `components/questions/active-filter-chips.tsx` | Create | Removable chips for active filters |
| `components/questions/sort-menu.tsx` | Create | Dropdown for `order_by` direction + field |
| `components/questions/search-input.tsx` | Create | Debounced search field with clear button |
| `components/questions/pagination.tsx` | Create | Prev/next + page-size + total count |
| `components/questions/mcq-options-display.tsx` | Create | Detail page: render MCQ options with correct indicators |
| `components/questions/reference-answer-display.tsx` | Create | Detail page: reference answer block |
| `components/questions/key-points-display.tsx` | Create | Detail page: weighted key-point list with category labels |

### shadcn primitives to add
| Component | Purpose |
|-----------|---------|
| `select` | Filter selects, sort, page-size |
| `command` | Searchable comboboxes (topic, author) |
| `popover` | Combobox triggers |
| `sheet` | Mobile-friendly filter drawer |

(Pagination is built by hand — shadcn's pagination is purely visual and we want server-driven state coupling.)

---

## Implementation Order

1. **Foundations**
   - Add enum union types and Question/McqOption/ReferenceAnswer/KeyPoint/Author/QuestionListParams interfaces to `lib/api/types.ts`
   - Create `lib/format/question-enums.ts` with humanizers
   - Create `lib/api/endpoints/questions.ts` and `lib/api/endpoints/authors.ts`
   - Install shadcn: `select`, `command`, `popover`, `sheet`

2. **Reusable display primitives**
   - `StatusBadge`, `DifficultyMeter`, `ContaminationBadge` — used by both list and detail

3. **List page — read-only path first**
   - `useQuestionFilters` hook
   - `QuestionRow` + `QuestionList` (loading skeleton, empty, error states)
   - Pagination
   - Render the page with NO filters yet — verify list/pagination work

4. **Filtering**
   - `SearchInput` (debounced, clears with `×`)
   - `SortMenu`
   - `FilterSheet` with all 8 selects (topic + author = comboboxes; rest = plain selects)
   - `ActiveFilterChips`
   - Wire everything to `useQuestionFilters`

5. **Detail page**
   - Editorial title-block layout
   - Metadata strip (status, type, cognitive_level, difficulty, tradition, contamination_risk)
   - Source attribution
   - Conditional body: `<McqOptionsDisplay>` for MCQ, `<ReferenceAnswerDisplay>` + `<KeyPointsDisplay>` for non-MCQ
   - Author + dates footer
   - 404 / error states
   - **No actions yet** — Phase 5+ adds Edit, Submit, etc.

6. **Polish**
   - "My questions" quick filter (sets `author_id` to current user) — small text link in header
   - Keyboard: `Cmd/Ctrl+K` could focus search (defer if it conflicts with future ⌘K command palette)

---

## Editorial Design Notes

### Question Row Layout
```
●  APPROVED                              Long Form · Application · Law School
   Discuss the doctrine of separation of powers under the 1999 Constitution...
   Constitutional Law · Dr. Adekoya · 2 days ago
```

- Row is a Link to `/questions/{id}`
- Status badge with colored dot on left
- Metadata strip top-right in eyebrow caps
- Question text (Fraunces, ~16px, 2-line clamp)
- Footer row (small caps): topic · author · relative time
- Hairline border bottom
- Hover: subtle bg tint

### Detail Page Sections
1. **Eyebrow** — section marker + "Question" + back-link to `/questions`
2. **Title block** — question text in large Fraunces (matches topic detail title)
3. **Hairline gold rule**
4. **Metadata strip** — status badge · type · cognitive_level · difficulty · legal_tradition · contamination_risk
5. **Source line** — "{source}" in italic Fraunces, with source_type as small caps
6. **Body** — branches:
   - MCQ: numbered/lettered option list, correct ones marked with subtle gold check, "Multi-select" badge if applicable
   - Non-MCQ: reference answer in serif body text, then key points table with weight + category
7. **Author + timestamps footer**
8. **Phase 5+ placeholder** — "Actions coming soon" or similar (can omit if it adds noise)

### Status Visual Treatment
| Status | Color | Treatment |
|--------|-------|-----------|
| `draft` | muted | Hollow dot |
| `in_review` | amber | Solid dot, possibly pulsing if user has the claim |
| `approved` | gold (primary) | Solid dot |
| `rejected` | destructive | Solid dot |

### Enum Humanizers
| Raw | Display |
|-----|---------|
| `mcq` | Multiple Choice |
| `short_answer` | Short Answer |
| `long_form_analysis` | Long Form |
| `case_analysis` | Case Analysis |
| `memorization` | Recall |
| `understanding` | Understanding |
| `application` | Application |
| `undergraduate` | Undergraduate |
| `law_school` | Law School |
| `practitioner` | Practitioner |
| `common_law` | Common Law |
| `customary_law` | Customary Law |
| `sharia` | Sharia |
| `statutory` | Statutory |
| `original` | Original |
| `bar_exam` | Bar Exam |
| `university_exam` | University Exam |
| `textbook` | Textbook |
| `case_law` | Case Law |
| `low` / `medium` / `high` | Low / Medium / High |
| `accuracy` / `reasoning` / `completeness` / `relevance` / `clarity` | Accuracy / Reasoning / Completeness / Relevance / Clarity |

---

## Edge Cases

| Case | UX |
|------|----|
| 0 results with filters | "No questions match your filters." + "Reset filters" button |
| 0 results no filters | "No questions yet." (researcher: "Create your first question." with link to Phase 5 route, even if not built — graceful 404 there) |
| Network error | Editorial error card + retry |
| 404 on detail | "Question not found" panel + link back to list |
| 401 mid-session | Already handled globally |
| Slow API | Skeleton rows shown; existing data persists during refetch (no flash to loading) |
| Search input typing | Debounced 300ms before URL push |
| Filter changes | Reset `page` to 1 |
| Sort change | Reset `page` to 1 |
| `claimed_at` expired (>30 min ago) | Backend already nulls `claimed_by` — display the question as unclaimed |
| Question with no topic_name (deleted topic?) | Defensive fallback "—" |

---

## Out of Scope (this phase)

- Create/edit forms → Phase 5
- Submit/withdraw → Phase 6
- Claim/review → Phase 7
- Audit log/history → Phase 8
- Export → Phase 11
- `<TopicSelect>` reusable component for FORMS → Phase 5 (the filter dropdown here is a different component since it deals with slugs and is single-select)
- Saved filter presets — defer
- ⌘K command palette — defer to a future polish phase
- Bulk operations — not in API
- Question stats / "popularity" — not in API

---

## Verification Checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds with `/questions` (static) and `/questions/[id]` (dynamic) registered
- [ ] List loads with default sort (newest first)
- [ ] Pagination prev/next works; page persists on refresh
- [ ] Each filter (search, topic, type, cognitive level, difficulty, tradition, contamination, status, author, sort) updates the URL and refetches
- [ ] Active filters appear as chips and are removable individually
- [ ] "Clear all" resets to defaults
- [ ] Empty state with filters shows reset button
- [ ] Empty state without filters shows different copy
- [ ] Loading skeletons appear during fetch
- [ ] Error state shows retry
- [ ] Click a row → navigates to detail
- [ ] Detail page renders MCQ options correctly (single + multi-select variants)
- [ ] Detail page renders non-MCQ reference answer + key points
- [ ] 404 detail page shows friendly panel
- [ ] Status badges show correct colors for all 4 statuses
- [ ] Difficulty meter shows correct level
- [ ] Contamination risk badge displays correctly
- [ ] Search input debounces (no URL spam while typing)
- [ ] Light + dark themes look correct on both pages
