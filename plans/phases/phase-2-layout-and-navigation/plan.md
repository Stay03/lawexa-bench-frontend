# Phase 2: Layout & Navigation

**Status:** In progress
**Depends on:** Phase 1 (Auth)
**Unlocks:** All subsequent feature phases

---

## Aesthetic Direction: Editorial Legal Gravitas

A scholarly, restrained interface that treats the bench platform like a serious academic journal. Distinctive serif display type pairs with clean sans body. Gold is a precise accent — never wallpaper. Hair-thin rules, generous negative space, warm paper tones, subtle grain texture.

**Type pairing:**
- Display: **Fraunces** (variable serif, optical sizing, opinionated italic)
- UI/Body: **Geist Sans** (already installed)
- Mono: **Geist Mono** (already installed) — for tabular numerics, IDs, codes

**Editorial flourishes:**
- Section numerators (`No. 01`, `Section II`)
- Small-caps tracking-wide labels
- Hair-thin gold rules as visual separators
- Tabular numerics for stats
- Subtle paper grain overlay

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `app/globals.css` | Modify | Add display font variable, paper grain texture, editorial type utilities |
| `app/layout.tsx` | Modify | Load Fraunces font |
| `app/(dashboard)/layout.tsx` | Create | Sidebar + topbar shell for all authenticated pages |
| `app/(dashboard)/page.tsx` | Create | Editorial dashboard home |
| `app/page.tsx` | Delete | Move to (dashboard)/page.tsx |
| `components/layout/app-sidebar.tsx` | Create | Sidebar with grouped role-aware nav |
| `components/layout/app-topbar.tsx` | Create | Topbar with breadcrumbs + actions |
| `components/layout/user-menu.tsx` | Create | User profile dropdown |
| `components/layout/theme-toggle.tsx` | Create | Light/dark switch |
| `components/layout/nav-config.ts` | Create | Role-aware nav definition |
| `components/ui/dropdown-menu.tsx` | Add (shadcn) | For user menu |
| `components/ui/avatar.tsx` | Add (shadcn) | User avatar |
| `components/ui/separator.tsx` | Add (shadcn) | Visual rules |
| `components/ui/tooltip.tsx` | Add (shadcn) | Icon tooltips |
| `components/ui/skeleton.tsx` | Add (shadcn) | Loading states |

---

## Sidebar Design

- 240px wide, fixed
- Lawexa wordmark + "BENCH" in italic serif at top
- Grouped nav sections with small-caps headers: PLATFORM / REVIEW / ADMIN
- Each nav item: icon (HugeIcons) + label, active state has gold dot indicator + bold weight + subtle bg tint
- Thin vertical gold rail along the active item's left edge
- User card pinned to bottom (avatar + name + role)
- Light mode: warm cream background; dark mode: deep charcoal

## Topbar Design

- Sticky, generous height (64px)
- Left: breadcrumbs in small caps + tracking
- Right: ⌘K search trigger / theme toggle / user menu
- Hair-thin gold rule below

## Dashboard Home Design

- Editorial greeting: "Good morning, Stay" in Fraunces display, large, with date as small-caps subtitle
- "Issue No. 047" type marker for personality
- Stats row: 4 cards with HUGE tabular numbers, tiny small-caps labels (Total, Drafts, In Review, Approved)
- Recent activity feed — like a journal log
- Coverage gaps preview — encourages action

## Verification

- `npm run typecheck` — no errors
- `npm run lint` — no errors
- `npm run build` — clean build
- Sidebar collapses on mobile
- Theme toggle switches smoothly
- User menu opens with avatar / role / sign out
- Editorial typography reads beautifully in both themes
