# Lawexa Bench — API Reference

**Base URL:** `http://localhost:8011/api` (dev) | `https://bench-api.lawexa.com/api` (prod)
**Interactive Docs:** `{base_url}/docs` (Swagger UI) | `{base_url}/redoc`

---

## Authentication

All endpoints except `GET /api/health` and `GET /api/topics` require a JWT in the Authorization header.

```
Authorization: Bearer <token>
```

### Login Flow (Login with Lawexa)

Authentication uses a popup-based SSO flow via lawexa.com:

```
1. User clicks "Login with Lawexa"
2. Frontend opens popup → https://lawexa.com/auth/grant?client_id=bench-app&redirect_uri=<your_origin>/callback
3. User authenticates on Lawexa (or is already logged in)
4. Popup sends scoped token back via window.postMessage
5. Frontend sends scoped token to bench backend
6. Backend verifies with Lawexa API, issues a bench JWT
7. All subsequent API calls use the bench JWT
```

**Frontend implementation:**

```javascript
// 1. Open the popup
const popup = window.open(
  'https://lawexa.com/auth/grant?client_id=bench-app&redirect_uri=' + window.location.origin + '/callback',
  'lawexa-auth',
  'width=480,height=600,popup=yes'
);

// 2. Listen for the scoped token
window.addEventListener('message', async (event) => {
  if (event.origin !== 'https://lawexa.com') return;
  if (event.data?.type !== 'lawexa:grant') return;

  const scopedToken = event.data.token;

  // 3. Send to bench backend
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lawexa_token: scopedToken }),
  });

  const data = await response.json();
  // 4. Store the bench JWT
  localStorage.setItem('bench_token', data.access_token);
  // data.user contains: { id, name, email, role, bio, is_active, created_at, updated_at }
});
```

**Allowed dev redirect origins** (configured by Lawexa frontend team): `localhost:3000`, `localhost:3001`, `localhost:5173`

### Login Endpoint

```
POST /api/auth/login
Content-Type: application/json

{ "lawexa_token": "<scoped token from Lawexa popup>" }
```

**Response 200:**
```json
{
  "access_token": "eyJhbG...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "name": "Dr. Adekoya",
    "email": "adekoya@unilag.edu.ng",
    "role": "researcher",
    "bio": null,
    "is_active": true,
    "questions_authored": 12,
    "created_at": "2026-04-02T12:00:00",
    "updated_at": "2026-04-02T12:00:00"
  }
}
```

**Error 401:** `"Unable to verify with Lawexa. Please try again later."` — Lawexa token invalid/expired.

**Error 401:** `"Your Lawexa account role does not have access to the bench app. Contact an administrator."` — user has a `user`, `guest`, or `bot` role on Lawexa (only `researcher`, `admin`, and `superadmin` are allowed).

JWT expires after **90 days**. No refresh endpoint — user re-logs in via the popup.

### Logout

No server endpoint. Delete the JWT from localStorage.

### Get Current User

```
GET /api/auth/me
```

**Response 200:** Same user object as login response.

Use this on app load to verify the stored JWT is still valid. If it returns 401, clear localStorage and show the login screen.

---

## Roles

Roles are synced from Lawexa on each login. The bench app uses these three roles:

| Role | Level | Permissions |
|------|-------|-------------|
| `researcher` | 1 | Create questions, edit own drafts, submit/withdraw, view all |
| `admin` | 2 | + Review others' questions, manage topics, edit any draft, revert approved |
| `super_admin` | 3 | + Manage researcher accounts (activate/deactivate) |

**Blocked roles:** Users with `user`, `guest`, or `bot` roles on Lawexa cannot log in to the bench app.

**Role mapping from Lawexa:** `superadmin` → `super_admin`, `admin` → `admin`, `researcher` → `researcher`

**First user bootstrap:** The very first user to log in is automatically promoted to `super_admin` regardless of their Lawexa role.

**Role sync:** On login, roles are synced from Lawexa but never downgraded. If a user was promoted locally, a lower Lawexa role won't override it.

---

## Enum Values

Use these exact strings in request payloads and expect them in responses:

| Field | Values |
|-------|--------|
| `legal_tradition` | `common_law`, `customary_law`, `sharia`, `statutory` |
| `question_type` | `mcq`, `short_answer`, `long_form_analysis`, `case_analysis` |
| `cognitive_level` | `memorization`, `understanding`, `application` |
| `difficulty` | `undergraduate`, `law_school`, `practitioner` |
| `source_type` | `original`, `bar_exam`, `university_exam`, `textbook`, `case_law` |
| `contamination_risk` | `low`, `medium`, `high` |
| `status` | `draft`, `in_review`, `approved`, `rejected` |
| `role` | `researcher`, `admin`, `super_admin` |
| `review_decision` | `approved`, `rejected`, `needs_revision` |
| `key_point_category` | `accuracy`, `reasoning`, `completeness`, `relevance`, `clarity` |

---

## Error Format

All errors return JSON:

```json
{ "detail": "Human-readable error message" }
```

Validation errors (422):
```json
{
  "detail": [
    {
      "type": "value_error",
      "loc": ["body", "legal_tradition"],
      "msg": "Input should be 'common_law', 'customary_law', 'sharia' or 'statutory'"
    }
  ]
}
```

| Code | Meaning |
|------|---------|
| 400 | Business rule violation (e.g., "Only Draft questions can be edited") |
| 401 | Missing or invalid/expired JWT |
| 403 | Insufficient role or permission |
| 404 | Resource not found (or soft-deleted) |
| 409 | Conflict — concurrent edit (stale `updated_at`) or claim collision |
| 422 | Validation error (invalid enum, missing required field, etc.) |

---

## Endpoints

### Health

```
GET /api/health → { "status": "ok" }
```

No auth required.

---

### Topics

#### List Topics

```
GET /api/topics
GET /api/topics?include_inactive=true   (Admin+ only)
```

No auth required for active-only listing. `include_inactive=true` requires Admin or higher (403 otherwise). Returns array sorted by name.

`question_count` is the number of non-deleted questions referencing this topic (all statuses).

```json
[
  {
    "id": "uuid",
    "name": "Constitutional Law",
    "slug": "constitutional_law",
    "description": null,
    "is_active": true,
    "question_count": 24,
    "created_at": "...",
    "updated_at": "..."
  }
]
```

#### Create Topic (Admin+)

```
POST /api/topics
{ "name": "Tax Law", "description": "Optional description" }
→ 201
```

Slug is auto-generated from name.

#### Get Topic

```
GET /api/topics/{id}
```

Returns a single topic. Access rules mirror the list endpoint:
- **Active topics** are publicly readable (no auth required)
- **Inactive topics** require Admin+ (403 otherwise)
- **Invalid token** returns 401 (re-login), not 403
- Unknown ID returns 404

Response shape is identical to a list item (including `question_count`).

#### Update Topic (Admin+)

```
PATCH /api/topics/{id}
{ "name": "New Name", "description": "...", "is_active": false }
```

Deactivation is blocked if approved questions reference the topic (returns 400).

---

### Questions

#### List Questions

```
GET /api/questions?page=1&page_size=20
```

**Query Parameters (all optional, combinable):**

| Param | Type | Example |
|-------|------|---------|
| `q` | text search | `?q=fundamental+rights` |
| `topic` | slug | `?topic=constitutional_law` |
| `question_type` | enum | `?question_type=mcq` |
| `cognitive_level` | enum | `?cognitive_level=application` |
| `difficulty` | enum | `?difficulty=law_school` |
| `legal_tradition` | enum | `?legal_tradition=common_law` |
| `contamination_risk` | enum | `?contamination_risk=low` |
| `status` | enum | `?status=draft` |
| `author_id` | UUID | `?author_id=...` |
| `order_by` | string | `?order_by=-created_at` (prefix `-` for desc) |
| `page` | int >= 1 | default 1 |
| `page_size` | int 1-100 | default 20 |

Allowed `order_by` values: `created_at`, `updated_at`, `difficulty`

**Response:**
```json
{
  "items": [ /* QuestionResponse objects */ ],
  "total": 150,
  "page": 1,
  "page_size": 20
}
```

#### Create Question

```
POST /api/questions
```

**Non-MCQ example (short_answer / long_form_analysis / case_analysis):**
```json
{
  "text": "Discuss the concept of fundamental rights under Chapter IV.",
  "topic_id": "uuid-of-topic",
  "legal_tradition": "statutory",
  "question_type": "long_form_analysis",
  "cognitive_level": "understanding",
  "difficulty": "law_school",
  "source": "Original — Dr. Adekoya",
  "source_type": "original",
  "contamination_risk": "low",
  "is_multi_select": false,
  "reference_answer": {
    "answer_text": "Chapter IV of the 1999 Constitution guarantees..."
  },
  "key_points": [
    { "point_text": "Must cite Sections 33-46", "weight": 3, "category": "accuracy" },
    { "point_text": "Must discuss enforcement under Section 46", "weight": 2, "category": "completeness" }
  ]
}
```

**MCQ example (single-select):**
```json
{
  "text": "Which section guarantees right to life?",
  "topic_id": "uuid-of-topic",
  "legal_tradition": "statutory",
  "question_type": "mcq",
  "cognitive_level": "memorization",
  "difficulty": "undergraduate",
  "source": "2020 Nigerian Bar Exam, Paper III, Q5",
  "source_type": "bar_exam",
  "is_multi_select": false,
  "mcq_options": [
    { "text": "Section 33", "is_correct": true },
    { "text": "Section 34", "is_correct": false },
    { "text": "Section 35", "is_correct": false },
    { "text": "Section 36", "is_correct": false }
  ]
}
```

**MCQ example (multi-select):**
```json
{
  "is_multi_select": true,
  "mcq_options": [
    { "text": "Right to life", "is_correct": true },
    { "text": "Right to dignity", "is_correct": true },
    { "text": "Right to privacy", "is_correct": false },
    { "text": "Right to movement", "is_correct": false }
  ]
}
```

**Response 201:** Full QuestionResponse (see below).

**Contamination risk auto-default** (if omitted):
| source_type | default |
|-------------|---------|
| `original` | `low` |
| `bar_exam` | `high` |
| `university_exam` | `high` |
| `textbook` | `medium` |
| `case_law` | `medium` |

User can override by providing `contamination_risk` explicitly.

#### Validation Rules

**MCQ questions:**
- 3 to 6 options required
- `is_multi_select: false` → exactly 1 option must be `is_correct: true`
- `is_multi_select: true` → at least 2 options must be `is_correct: true`
- `reference_answer` and `key_points` are optional

**Non-MCQ questions (short_answer, long_form_analysis, case_analysis):**
- `reference_answer` is required
- At least 1 key point required
- `mcq_options` must be empty or omitted
- `is_multi_select` must be `false`

**Key points:**
- `weight` must be > 0 (any positive number — normalized at export time)

#### QuestionResponse Object

```json
{
  "id": "uuid",
  "text": "Question text...",
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
  "created_at": "2026-04-02T12:00:00",
  "updated_at": "2026-04-02T12:00:00",
  "mcq_options": [],
  "reference_answer": {
    "id": "uuid",
    "answer_text": "...",
    "author_id": "uuid",
    "author_name": "Dr. Adekoya",
    "created_at": "...",
    "updated_at": "..."
  },
  "key_points": [
    { "id": "uuid", "point_text": "Must cite...", "weight": 3.0, "category": "accuracy" }
  ]
}
```

#### Get Question

```
GET /api/questions/{id} → QuestionResponse
```

#### Update Question (Draft only)

```
PUT /api/questions/{id}
```

Body: same fields as create, all optional except `updated_at` (required for concurrency check).

```json
{
  "text": "Updated question text",
  "updated_at": "2026-04-02T12:00:00"
}
```

- Author can edit own drafts
- Admin+ can edit any draft (and reassign `author_id`)
- Returns **409** if `updated_at` doesn't match (someone else edited it)

#### Delete Question (Soft Delete)

```
DELETE /api/questions/{id} → 204
```

Author can delete own drafts. Admin+ can delete any question.

---

### Question Status Workflow

```
[Draft] ──submit──> [In Review] ──approve──> [Approved]
  ^                    |    |                     |
  |                    |    reject──> [Rejected]  |
  |                    |                          |
  |    needs_revision──┘                          |
  |    withdraw (author)                          |
  └───────────────────────────────────────────────┘
                                        revert (Admin+)
```

#### Submit for Review

```
POST /api/questions/{id}/submit
{ "updated_at": "2026-04-02T12:00:00" }
```

Draft → In Review. Author only.

#### Withdraw from Review

```
POST /api/questions/{id}/withdraw
{ "updated_at": "2026-04-02T12:00:00" }
```

In Review → Draft. Author only. Releases any active claim.

#### Revert to Draft (Admin+)

```
POST /api/questions/{id}/revert
{ "updated_at": "2026-04-02T12:00:00" }
```

Approved → Draft. Marks all prior reviews as superseded.

---

### Reviews

#### Review Queue (Admin+)

```
GET /api/reviews/queue?page=1&page_size=50
```

Returns In Review questions with claim status.

```json
{
  "items": [ /* QuestionResponse objects with claimed_by info */ ],
  "total": 12,
  "page": 1,
  "page_size": 50
}
```

#### Claim Question (Admin+)

```
POST /api/questions/{id}/claim → QuestionResponse
```

Locks the question for 30 minutes. Only one reviewer at a time. Cannot claim own question.

**409** if already claimed by someone else: `"Question already claimed by Dr. Smith"`

#### Release Claim

```
DELETE /api/questions/{id}/claim → QuestionResponse
```

Only the claiming reviewer can release.

#### Submit Review (Admin+)

```
POST /api/questions/{id}/review
{
  "decision": "approved",
  "comments": "Well-structured question with clear rubric."
}
```

Decision values: `approved`, `rejected`, `needs_revision`

Must hold an active (non-expired) claim. Cannot review own question.

| Decision | Status Transition |
|----------|-------------------|
| `approved` | In Review → Approved (increments `approved_version`) |
| `rejected` | In Review → Rejected |
| `needs_revision` | In Review → Draft |

#### Review History

```
GET /api/questions/{id}/reviews?page=1&page_size=20
```

```json
{
  "items": [
    {
      "id": "uuid",
      "question_id": "uuid",
      "reviewer_id": "uuid",
      "reviewer_name": "Admin User",
      "decision": "approved",
      "comments": "Looks good",
      "superseded": false,
      "created_at": "..."
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20
}
```

`superseded: true` means the question was reverted after this review — treat as stale.

---

### Audit Log

```
GET /api/questions/{id}/audit-log?page=1&page_size=50
```

Accessible to question author + Admin+.

```json
{
  "items": [
    {
      "id": "uuid",
      "question_id": "uuid",
      "actor_id": "uuid",
      "actor_name": "Dr. Adekoya",
      "action": "edited",
      "changes": {
        "text": { "old": "Old text", "new": "New text" }
      },
      "created_at": "..."
    }
  ],
  "total": 5,
  "page": 1,
  "page_size": 50
}
```

Actions: `created`, `edited`, `submitted`, `withdrawn`, `claimed`, `claim_released`, `reviewed`, `reverted`, `deleted`, `author_reassigned`

`changes` is only populated for `edited` and `author_reassigned` actions.

---

### Export

#### JSON Export

```
GET /api/export/json
```

#### CSV Export

```
GET /api/export/csv
```

Both export **only approved, non-deleted questions**. Key point weights are normalized (sum to 1.0).

**Filters (all optional):** `topic`, `question_type`, `cognitive_level`, `difficulty`, `legal_tradition`, `contamination_risk`

CSV returns as file download (`Content-Disposition: attachment`).

---

### Stats

#### Overview

```
GET /api/stats/overview
```

```json
{
  "total": 150,
  "by_status": [{ "label": "draft", "count": 45 }, ...],
  "by_topic": [{ "label": "Constitutional Law", "count": 20 }, ...],
  "by_question_type": [{ "label": "mcq", "count": 60 }, ...],
  "by_cognitive_level": [{ "label": "understanding", "count": 55 }, ...],
  "by_difficulty": [{ "label": "law_school", "count": 80 }, ...]
}
```

#### Coverage Gaps

```
GET /api/stats/coverage?threshold=3
```

Returns topic/type/difficulty combinations with fewer than `threshold` approved questions.

```json
{
  "gaps": [
    { "topic": "Criminal Law", "question_type": "case_analysis", "difficulty": "practitioner", "count": 0 }
  ],
  "threshold": 3
}
```

#### Topic Stats

```
GET /api/stats/topics/{topic_id}
```

Per-topic breakdown of questions (all non-deleted, all statuses). Returns 404 if topic doesn't exist.

```json
{
  "topic_id": "uuid",
  "topic_name": "Constitutional Law",
  "total": 24,
  "by_status": [{ "label": "approved", "count": 18 }, { "label": "draft", "count": 6 }],
  "by_question_type": [{ "label": "mcq", "count": 10 }, ...],
  "by_cognitive_level": [...],
  "by_difficulty": [...]
}
```

---

### Activity Feed

```
GET /api/activity?limit=10&offset=0
```

Recent audit-log entries across all questions, newest first. Use for the dashboard activity feed. Any logged-in user.

`limit` defaults to 10, max 100. `offset` for simple pagination. No `total` (it's a feed).

`question_text` is truncated at 120 characters with an ellipsis (`…`).

```json
{
  "items": [
    {
      "id": "uuid",
      "question_id": "uuid",
      "question_text": "Discuss the concept of fundamental rights…",
      "actor_id": "uuid",
      "actor_name": "Dr. Adekoya",
      "action": "submitted",
      "created_at": "2026-04-02T12:00:00"
    }
  ],
  "limit": 10
}
```

Actions: `created`, `edited`, `submitted`, `withdrawn`, `claimed`, `claim_released`, `reviewed`, `reverted`, `deleted`, `author_reassigned`

---

### Researchers

#### List Researchers (Super Admin only)

```
GET /api/researchers?page=1&page_size=20
```

Each researcher includes `questions_authored` (count of non-deleted questions they authored).

#### List Authors (any logged-in user)

```
GET /api/researchers/authors
```

Lightweight list for populating author filter dropdowns. Returns only active researchers who have authored ≥1 non-deleted question.

```json
[
  { "id": "uuid", "name": "Dr. Adekoya" },
  { "id": "uuid", "name": "Dr. Smith" }
]
```

#### Update Researcher (Super Admin only)

```
PUT /api/researchers/{id}
{ "is_active": false }
```

Can also set `"role": "admin"` etc. Cannot deactivate yourself.

---

## Optimistic Concurrency

All mutation endpoints (`PUT`, `submit`, `withdraw`, `revert`) require `updated_at` in the request body. This must match the value from your last `GET`. If another user modified the question in between, you get:

```
409 { "detail": "Question has been modified by another user. Please refresh and try again." }
```

**Frontend handling:** On 409, re-fetch the question and show the user the updated version. Let them re-apply their changes.

---

## Claim Expiry

Claims auto-expire after **30 minutes**. No background job — expiry is checked on every read. If a claim is expired:
- `claimed_by` and `claimed_at` will be `null` in the response
- The question is available for another reviewer to claim

**Frontend handling:** Show a countdown timer when the current user holds a claim. Warn at 5 minutes remaining.
