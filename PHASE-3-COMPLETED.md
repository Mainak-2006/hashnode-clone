# Phase 3 — Feed, Search & Profiles ✅

**Status:** Complete  
**Date:** November 9, 2026  
**Plan:** Days 7–9 of the 13-day roadmap (`PHASES.md`)  
**Milestone tag:** `phase-3-public`

---

## Summary

Phase 3 completes the public reading experience and author profiles. Visitors can browse a paginated feed, search by title, explore tags, open full articles, and view author profiles. Authors can edit their public profile from Settings and manage content from the dashboard. Draft privacy and server-side ownership remain enforced.

---

## What was built

### 1. Public feed and search — `/feed`

- Newest-first responsive card grid
- Debounced title search via `?q=` with a clear-search state
- Cover image, title, excerpt, author, date, tags, and reading time
- Loading skeletons, empty state, retryable error state
- “Load more” pagination with a per-page size of 9
- Authenticated prompt to write a first post when the feed is empty
- Drafts excluded from every result

### 2. Tags — `/tags` and `/tags/:slug`

- Tag directory with published-post counts and client-side filtering
- Tag page with header, paginated posts, related tags, and empty state
- Tag links wired through feed cards and article detail
- Unknown tags render a 404 state

### 3. Post detail — `/posts/:slug`

- Full Markdown article with GFM tables and Prism highlighting
- Cover image, author card, publication date, reading time, and tag links
- Copy-link button with clipboard feedback
- Owner-only Edit and Delete actions with confirmation
- Missing or unpublished slugs return a proper 404
- Next/previous navigation is intentionally omitted to keep the MVP focused

### 4. Public profiles — `/u/:id`

- Public author header with avatar, name, bio, and join date
- Published posts only, paginated
- Empty state for authors without published posts
- Profile links from the navbar, post cards, and article author cards

### 5. Settings — `/settings`

- Protected profile editor for name, bio, and avatar URL
- Client and server validation (name length, bio length, `http(s)` avatar URL)
- Auth state updated immediately after saving
- Link to the public profile and dashboard

### 6. Backend user API

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/users/:id` | Public | Public user fields + published posts only |
| `PUT` | `/api/users/me` | Protected | Update current user's name, bio, and avatar URL |

Public responses expose only `name`, `avatarUrl`, `bio`, and `createdAt`; email and password are never returned. Invalid IDs → `400`, unknown users → `404`, empty updates → `400`.

### 7. Navigation and route audit

- Navbar: Home, Feed, Tags, Dashboard, Write, avatar/profile, Settings, Log out
- Mobile menu closes on navigation and Escape
- Footer: Explore and Account links
- Protected routes verified: `/dashboard`, `/editor/new`, `/editor/:id`, `/settings`, `/markdown`
- Unauthenticated visitors are redirected to `/login` and returned to the intended page
- Invalid or expired tokens are cleared and trigger a sign-out

---

## Verification

- Search returns matching published posts and no drafts
- Load-more appends pages and preserves the active query
- Tag counts exclude drafts; tag pages never include drafts
- Post detail renders Markdown, tables, code blocks, author, tags, and cover image
- Owner actions appear only for the author; non-owners see no edit/delete controls
- Direct requests for draft slugs return `404`
- Public profiles include published posts only and never expose drafts or email
- Settings updates persist and refresh the navbar identity
- Route audit confirms every protected page redirects when signed out
- Responsive layouts checked at desktop, tablet, and mobile widths

---

## Key routes

| Route | Access | Page |
|---|---|---|
| `/` | Public | Landing page |
| `/feed` | Public | Feed + search |
| `/posts/:slug` | Public | Article detail |
| `/tags` | Public | Tag directory |
| `/tags/:slug` | Public | Posts by tag |
| `/u/:id` | Public | Public profile |
| `/login`, `/register` | Public | Auth |
| `/dashboard` | Protected | Author dashboard |
| `/editor/new`, `/editor/:id` | Protected | Post editor |
| `/settings` | Protected | Profile settings |

---

## Notes

- Phase 4 covers responsive/focus polish, the full QA pass, deployment configuration, and final documentation.

---

## Author

**Mainak Kundu** — [GitHub](https://github.com/Mainak-2006)
