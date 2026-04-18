# Lawexa Bench Frontend — Master Plan

**Stack:** Next.js 16 | React 19 | TypeScript 5.9 | Tailwind CSS 4 | shadcn/ui (Radix Luma)
**Backend:** FastAPI at `localhost:8011/api` (dev) | `bench-api.lawexa.com/api` (prod)
**Auth:** JWT via Lawexa SSO popup flow (90-day expiry, no refresh token)
**Roles:** `researcher` | `admin` | `super_admin`

---

## Phase 1: Foundation & Auth

**Goal:** API client, auth context, login/logout, route protection.

- [Phase 1 Plan](phases/phase-1-foundation-and-auth/plan.md)

**Key deliverables:**
- Typed fetch wrapper with JWT interceptor and error normalization
- Auth provider with user state, role, and token management
- "Login with Lawexa" popup SSO flow + `/callback` route
- Auth guard HOC/middleware for protected routes
- Auto-verify token on app load via `GET /api/auth/me`
- Logout (clear token, reset state, redirect)

---

## Phase 2: Layout & Navigation

**Goal:** App shell, role-aware nav, responsive sidebar/topbar.

**Key deliverables:**
- App shell layout (sidebar + topbar + content area)
- Role-aware navigation links (researcher vs admin vs super_admin)
- User profile dropdown (name, role badge, logout)
- Breadcrumb component
- Global loading/error boundary components

---

## Phase 3: Topics

**Goal:** Topic browsing and admin topic management.

**Key deliverables:**
- Topics list page (public, no auth)
- Admin: create, edit, deactivate topics
- Reusable topic selector component (for question forms)

---

## Phase 4: Questions — List & View

**Goal:** Browse, search, filter, and view questions.

**Key deliverables:**
- Paginated questions list with server-side pagination
- Filter bar (topic, type, difficulty, cognitive level, tradition, contamination risk, status, full-text search)
- Sort controls (created_at, updated_at, difficulty — asc/desc)
- Question detail page (full response with MCQ options, reference answer, key points)
- Status badge component

---

## Phase 5: Questions — Create & Edit

**Goal:** Full question authoring with conditional forms and concurrency handling.

**Key deliverables:**
- Question creation form with conditional sections by `question_type`
- MCQ options editor (dynamic add/remove, 3-6 validation, single/multi-select)
- Reference answer + weighted key points editor (non-MCQ)
- Contamination risk auto-default based on `source_type`
- Edit flow (draft only, `updated_at` concurrency check)
- 409 conflict resolution (re-fetch + user notification)
- Soft delete with confirmation dialog

---

## Phase 6: Question Workflow & Status Transitions

**Goal:** Status lifecycle UI for authors.

**Key deliverables:**
- Submit for review (draft -> in_review)
- Withdraw from review (in_review -> draft)
- Visual workflow indicator showing current status and available transitions
- Confirmation dialogs for state changes

---

## Phase 7: Review System (Admin+)

**Goal:** Full review workflow for admins.

**Key deliverables:**
- Review queue page with claim status indicators
- Claim/release with 30-minute countdown timer and 5-min warning
- Review submission form (approve / reject / needs_revision + comments)
- Review history timeline per question
- Self-review prevention (UI enforcement)

---

## Phase 8: Audit Log

**Goal:** Per-question activity history.

**Key deliverables:**
- Audit log timeline component
- Action type badges (created, edited, submitted, claimed, reviewed, etc.)
- Inline change diff display for `edited` and `author_reassigned` actions
- Access control: visible to question author + admin+

---

## Phase 9: Dashboard & Stats

**Goal:** Analytics overview and coverage gap identification.

**Key deliverables:**
- Overview dashboard with summary stats
- Charts: questions by status, topic, type, cognitive level, difficulty
- Coverage gaps table with adjustable threshold
- "My Questions" researcher summary view

---

## Phase 10: Researcher Management (Super Admin)

**Goal:** User administration.

**Key deliverables:**
- Paginated researchers list
- Activate/deactivate toggle
- Role assignment (promote researcher -> admin)
- Self-deactivation prevention

---

## Phase 11: Export

**Goal:** Approved question data export.

**Key deliverables:**
- Export page/modal with filter controls
- JSON download
- CSV file download
- Filters: topic, type, cognitive level, difficulty, tradition, contamination risk

---

## Phase 12: Polish & Production

**Goal:** Production readiness.

**Key deliverables:**
- Toast/notification system for success/error feedback
- Empty states for all list views
- Responsive design pass (mobile + tablet)
- Accessibility audit (keyboard navigation, ARIA, screen reader)
- Loading skeleton components
- Environment config (dev vs prod API URL switching)
