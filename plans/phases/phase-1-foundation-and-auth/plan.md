# Phase 1: Foundation & Auth

**Status:** Not started
**Depends on:** Nothing (first phase)
**Unlocks:** Phase 2 (Layout & Navigation)

---

## Objective

Set up the API client layer and complete authentication flow so that every subsequent phase can make authenticated API calls and enforce role-based access.

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API client | Typed fetch wrapper in `lib/api/` | No extra dependency; aligns with Next.js patterns |
| Auth state | React Context + `useReducer` | Sufficient for single-user auth state; avoids external store |
| Token storage | `localStorage` | JWT has 90-day expiry, no refresh token — simple persistence |
| Route protection | Next.js middleware + client-side guard | Middleware for server-side redirects; guard for client-side SPA nav |
| SSO popup | `window.open` + `postMessage` | Matches Lawexa's documented popup grant flow |

---

## File Structure

```
lib/
  api/
    client.ts            # Fetch wrapper: base URL, JWT header, error normalization
    errors.ts            # Typed API error classes (ApiError, ValidationError, ConflictError)
    types.ts             # Shared API types (PaginatedResponse, User, etc.)
    endpoints/
      auth.ts            # login(), getMe() — auth endpoint functions
hooks/
  use-auth.ts            # useAuth() hook — exposes auth context
contexts/
  auth-context.tsx       # AuthProvider, auth reducer, context definition
components/
  auth/
    login-button.tsx     # "Login with Lawexa" button (opens popup)
    auth-guard.tsx       # Wrapper that redirects unauthenticated users
app/
  callback/
    page.tsx             # Popup callback page — receives postMessage, closes popup
  (auth)/
    login/
      page.tsx           # Login page with branding + login button
```

---

## Tasks

### 1. Environment & Config

- [ ] Create `lib/config.ts` — export `API_BASE_URL` from `NEXT_PUBLIC_API_URL` env var, defaulting to `http://localhost:8011/api`
- [ ] Add `NEXT_PUBLIC_API_URL` to `.env.local` (gitignored)
- [ ] Add `.env.example` with placeholder

### 2. API Client

- [ ] Create `lib/api/errors.ts`
  - `ApiError` (status, message, detail)
  - `ValidationError` extends `ApiError` (field-level errors from 422)
  - `ConflictError` extends `ApiError` (409 — stale `updated_at`)
  - `UnauthorizedError` extends `ApiError` (401)
- [ ] Create `lib/api/types.ts`
  - `User` interface (`id`, `name`, `email`, `role`, `bio`, `is_active`, `created_at`, `updated_at`)
  - `LoginResponse` (`access_token`, `token_type`, `user`)
  - `PaginatedResponse<T>` generic
  - Role union type: `"researcher" | "admin" | "super_admin"`
- [ ] Create `lib/api/client.ts`
  - `apiFetch<T>(path, options)` — prepends base URL, injects `Authorization: Bearer` from localStorage, parses JSON, throws typed errors
  - Handle 401 globally: clear token, redirect to login
  - Handle 409: throw `ConflictError`
  - Handle 422: throw `ValidationError` with parsed field errors
  - Handle other 4xx/5xx: throw `ApiError`

### 3. Auth Endpoints

- [ ] Create `lib/api/endpoints/auth.ts`
  - `login(lawexaToken: string): Promise<LoginResponse>` — `POST /api/auth/login`
  - `getMe(): Promise<User>` — `GET /api/auth/me`

### 4. Auth Context & Provider

- [ ] Create `contexts/auth-context.tsx`
  - State: `{ user: User | null; token: string | null; status: "loading" | "authenticated" | "unauthenticated" }`
  - Actions: `LOGIN_SUCCESS`, `LOGOUT`, `SET_LOADING`
  - On mount: check localStorage for token -> call `getMe()` -> set user or clear token
  - `login(lawexaToken)`: call `login()` endpoint, store token, set user
  - `logout()`: clear localStorage, reset state
  - Expose `isAdmin`, `isSuperAdmin` computed booleans
- [ ] Create `hooks/use-auth.ts` — thin wrapper around `useContext(AuthContext)` with error if used outside provider
- [ ] Wire `AuthProvider` into root `app/layout.tsx`

### 5. Login Page & SSO Popup Flow

- [ ] Create `app/(auth)/login/page.tsx`
  - Lawexa branding / welcome message
  - "Login with Lawexa" button
  - Redirect to dashboard if already authenticated
- [ ] Create `components/auth/login-button.tsx`
  - Opens popup: `https://lawexa.com/auth/grant?client_id=bench-app&redirect_uri={origin}/callback`
  - Listens for `message` event from popup
  - Validates `event.origin === "https://lawexa.com"` and `event.data.type === "lawexa:grant"`
  - Calls `auth.login(scopedToken)`
  - Handles loading state and error display
- [ ] Create `app/callback/page.tsx`
  - Minimal page loaded inside the popup
  - Receives the grant from Lawexa and relays via `window.opener.postMessage`
  - Auto-closes the popup after relay

### 6. Auth Guard & Route Protection

- [ ] Create `components/auth/auth-guard.tsx`
  - Wraps children; shows loading spinner while auth status is `"loading"`
  - Redirects to `/login` if `"unauthenticated"`
  - Optional `requiredRole` prop for role-based gating (e.g., `admin`, `super_admin`)
  - Shows "Access Denied" if role insufficient
- [ ] Create `middleware.ts` (Next.js middleware)
  - Check for `bench_token` in cookies or redirect to `/login`
  - Allowlist: `/login`, `/callback`, public assets

### 7. Logout

- [ ] Add logout handler in auth context (clear localStorage `bench_token`, reset user state)
- [ ] Redirect to `/login` after logout
- [ ] Wire a temporary logout button (will be moved to profile dropdown in Phase 2)

---

## Validation Checklist

- [ ] Fresh visit with no token -> redirected to login page
- [ ] Click "Login with Lawexa" -> popup opens -> token exchange -> user logged in
- [ ] Page refresh after login -> token revalidated via `getMe()` -> stays logged in
- [ ] Expired/invalid token on refresh -> cleared, redirected to login
- [ ] Logout -> token cleared, redirected to login
- [ ] Non-researcher role (user/guest/bot) -> login rejected with error message
- [ ] Admin route accessed by researcher -> "Access Denied" shown
- [ ] API call with expired token -> 401 caught globally, redirected to login

---

## API Endpoints Used

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/auth/login` | Exchange Lawexa token for bench JWT |
| `GET` | `/api/auth/me` | Verify JWT and get current user |

---

## Notes

- No refresh token exists. JWT lasts 90 days. On expiry, user must re-authenticate via popup.
- Roles are synced from Lawexa on each login but never downgraded locally.
- The first user to log in is auto-promoted to `super_admin`.
- Allowed redirect origins for dev: `localhost:3000`, `localhost:3001`, `localhost:5173`.
- The callback page may need to handle the case where `window.opener` is null (popup blocked or navigated away).
