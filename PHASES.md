# Hashnode Clone — 13-Day Development Plan

A full-stack developer blogging platform inspired by Hashnode, built with the MERN stack. This roadmap compresses the original four phases into **13 consecutive working days**, with a working milestone, commit, and tag at the end of each phase.

- **Start:** Sunday, November 8, 2026
- **Finish:** Friday, November 20, 2026
- **Daily effort:** 4–6 focused hours
- **Stack:** MongoDB, Express.js, React.js, Node.js, Mongoose, JWT, bcryptjs, Axios, React Router, Context API, React Markdown, syntax highlighter, Vite
- **Constraint:** MVP first. Stretch goals must not delay Phase 4.

> Day numbers are the source of truth. If you start on a different date, shift the dates but keep the sequence.

---

## Phase Overview

| Phase | Days | Target | Main Outcome | Milestone Tag |
|---|---|---|---|---|
| **Phase 1** — Foundation & Auth | 1–2 | 25% | Backend repaired, auth end-to-end, client scaffolded | `phase-1-auth` |
| **Phase 2** — CRUD & Markdown | 3–6 | 50% | Post CRUD, ownership, tags, Markdown, editor, dashboard | `phase-2-content` |
| **Phase 3** — Feed, Search & Profiles | 7–9 | 75% | Public feed, search, tag pages, post detail, profiles | `phase-3-public` |
| **Phase 4** — Polish, QA & Deploy | 10–13 | 100% | Responsive polish, testing, deployment, documentation | `v1.0.0` |

---

## Starting Point / Reality Check

Phase 1 is **partially complete**. The backend scaffold exists, but these gaps must be closed on Days 1–2:

- `client/` is empty — no Vite app yet.
- `GET /api/auth/me` is a placeholder.
- There is no JWT middleware.
- Register does not return a token, so the client cannot persist a new session.
- The User model uses `username`, `profilePicture`, `profileBio`; the PRD requires `name`, `bio`, `avatarUrl`.
- There are no `Post`/`Tag` models or `/api/posts` routes — only placeholder `/api/blogs`.
- `server/package.json` has no `dev`/`start` scripts; `.env.example` is referenced but missing.

The final implementation follows the PRD: `Post` model and `/api/posts` routes replace the `Blog`/`/api/blogs` placeholders.

---

## Phase 1 — Foundation & Authentication (Days 1–2, 25%)

> **Status: complete (Nov 7, 2026).** Backend auth, client auth UI, persistence, and protected routes are implemented and verified. See [`PHASE-1-COMPLETED.md`](./PHASE-1-COMPLETED.md).

### Day 1 — Backend repair and complete auth

- Restructure `server/` to the PRD layout: `server.js`, `config/db.js`, `middleware/authMiddleware.js`, `middleware/errorMiddleware.js`, `utils/generateToken.js`.
- Rewrite `User` schema to `name`, `email`, `password`, `bio`, `avatarUrl`, `timestamps`.
- Keep bcrypt hashing in a `pre('save')` hook and strip the password from all responses.
- Implement:
  - `POST /api/auth/register` → returns `{ token, user }`
  - `POST /api/auth/login` → returns `{ token, user }`
  - `GET /api/auth/me` → protected, returns current user
- Add real JWT verification middleware, consistent `400/401/403/404/500` errors, input validation, and `/api/health`.
- Add `dev`, `start`, and `seed` scripts; install `nodemon`; create `server/.env.example`.
- Verify with Postman/curl:
  - register, login, and `/me` succeed
  - missing/invalid token → 401
  - duplicate email → 400
  - password in MongoDB is a bcrypt hash
- **Commit:** `feat(server): complete phase 1 auth foundation`

### Day 2 — React scaffold and auth UI

- Scaffold the empty `client/` with Vite + React.
- Install `react-router-dom`, `axios`, `react-markdown`, `remark-gfm`, `react-syntax-highlighter`, `lucide-react`.
- Add an Axios instance with a JWT request interceptor and global 401 handling.
- Build `AuthContext`, `useAuth`, `ProtectedRoute`, app shell, Navbar, and Footer.
- Build Login and Register pages with:
  - client-side validation
  - pending/disabled states
  - readable error messages
  - logout
  - persisted login via `/api/auth/me`
- Verify refresh persistence, invalid-token redirect, and redirect-back-after-login.
- **Gate:** full auth flow works from the browser.
- **Commit + tag:** `phase-1-auth`
- Update the Phase 1 completion note.

---

## Phase 2 — Blog CRUD & Markdown (Days 3–6, 50%)

### Day 3 — Models and read/create APIs

- Create `Post` and `Tag` models per the PRD.
- Add slug generation with uniqueness handling, excerpt generation, and a reading-time virtual.
- Implement:
  - `POST /api/posts`
  - `GET /api/posts` — published only, newest first, paginated
  - `GET /api/posts/:slug`
- Implement tag find-or-create and attach tags to posts, maximum 5.
- Verify drafts never appear in the public list.

### Day 4 — Ownership, edit/delete, and tags API

- Implement `PUT /api/posts/:id` and `DELETE /api/posts/:id` with **server-side owner checks** returning 403.
- Add `GET /api/posts/mine` and a protected `GET /api/posts/id/:id` so the editor can load drafts.
- Implement `GET /api/tags` with published-post counts and `GET /api/tags/:slug/posts` (published only).
- Add validation and error handling for missing title/content, invalid status, bad IDs, and duplicate slugs.
- Test the full matrix: owner succeeds, non-owner gets 403, drafts are hidden publicly.

### Day 5 — Markdown and syntax highlighting

- Build `MarkdownEditor` with a formatting toolbar.
- Build `MarkdownPreview` with `react-markdown` + `remark-gfm` + Prism highlighting.
- Register common languages and aliases (JS, TS, JSX, Python, JSON, Bash, etc.).
- Add a copy-code button.
- Ensure raw HTML is not rendered.
- Test tables, lists, links, blockquotes, and code fences.

### Day 6 — Editor, dashboard, and Phase 2 gate

- Build `PostEditor` for create and edit:
  - title, Markdown body, cover URL, tags
  - draft/publish/unpublish
  - validation and redirect after save
- Build `Dashboard`:
  - all posts
  - draft/published filters
  - edit/delete with confirmation
  - loading, empty, and error states
- Add `PostCard`/`PostList` and a basic paginated public feed shell. Search and tag filtering come in Phase 3.
- Verify: create draft → keep private → publish → appears publicly → edit → delete.
- **Gate:** CRUD, ownership, drafts, Markdown, highlighting, and pagination all work.
- **Commit + tag:** `phase-2-content`
- Update the Phase 2 completion note.

---

## Phase 3 — Tags, Filtering, Search & Profiles (Days 7–9, 75%)

### Day 7 — Complete public feed and search

- Finish the Feed page: newest-first cards with cover, title, excerpt, author, date, tags, and reading time.
- Add title search via `?q=` and a clear-search state.
- Add loading skeletons, empty state, error state, and “Load more” pagination.
- Confirm drafts are excluded from the feed, search results, and post detail.

### Day 8 — Tags and post detail

- Build the Tags page: all tags, published post counts, client-side filter.
- Build `TagPage`: tag header, paginated published posts, related tags, empty state.
- Build `PostDetail`:
  - full Markdown
  - cover image
  - author card
  - tag links
  - copy-link
  - owner-only edit/delete with confirmation
- Return a proper 404 for missing or unpublished posts.

### Day 9 — Profiles, settings, and protected routes

- Implement `GET /api/users/:id` (published posts only) and `PUT /api/users/me`.
- Build the public Profile page and Settings page for name, bio, and avatar URL.
- Update auth state after saving the profile.
- Finish Navbar/mobile navigation, the 404 page, and audit all protected routes.
- Verify a public profile never exposes drafts.
- **Gate:** a visitor can browse, search, filter, open posts, and view profiles; an author can manage content.
- **Commit + tag:** `phase-3-public`
- Update the Phase 3 completion note.

---

## Phase 4 — Polish, QA & Deployment (Days 10–13, 100%)

### Day 10 — Responsive and UX polish

- Check layouts at 1024 px, 768 px, and 480 px:
  - navbar
  - feed grid
  - editor split view
  - dashboard rows
  - profile header
  - forms
- Ensure code blocks and wide tables scroll instead of breaking the page.
- Add consistent focus states, loading/empty/error components, and readable article typography.
- Dark mode only if the MVP is already green; otherwise defer it.

### Day 11 — Full QA and security pass

Test the baseline-pass cases:

- Password is stored only as a bcrypt hash.
- Non-owner `PUT`/`DELETE` via direct API call → 403.
- Drafts are absent from feed, tag pages, profiles, and direct post URLs.
- Invalid/expired token → 401 and client redirect.
- Bad form submissions return readable validation errors.
- Markdown cannot inject raw HTML.

Then:

- Fix bugs.
- Add a seed script with demo users/posts.
- Create a repeatable API smoke test.
- Run `npm run build` and fix all client warnings/errors.

### Day 12 — Deployment

- Create a MongoDB Atlas cluster and database user.
- Deploy backend to Render or Railway with:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `CLIENT_URL`
  - `NODE_ENV=production`
- Deploy client to Vercel or Netlify with:
  - `VITE_API_URL`
  - SPA rewrites
- Configure production CORS and verify the live client can call the live API.
- Smoke-test register, login, publish, feed, search, tag page, profile, and delete on the deployed URL.

### Day 13 — Final verification and handoff

- Test mobile, desktop, hard refresh, logout/login, and direct-route loading.
- Update `README.md`:
  - setup
  - environment variables
  - scripts
  - API table
  - demo credentials
  - deployment notes
- Update `PHASES.md` with actual completion dates.
- Create `PHASE-4-COMPLETED.md`.
- Final commit, tag `v1.0.0`, and push to GitHub.
- Use remaining hours as buffer for anything that slipped.

---

## Scope Guard

Do **not** let these delay Phase 4:

- comments
- likes/reactions
- follow/follower count
- personalized feed
- Cloudinary image upload
- infinite scroll
- elaborate dark mode

These are stretch goals and may only be added after every MVP item is complete, tested, and deployed.

---

## Definition of Done

The 13-day build succeeds when:

- Password hashing, JWT auth, and refresh persistence work.
- Ownership is enforced on the server.
- Drafts are hidden everywhere public.
- Markdown and syntax highlighting work.
- Tags, tag pages, tag counts, search, profiles, and the dashboard work.
- The deployed app works for both a guest and a logged-in author.
- A clean clone can run using only the README.

If a day slips, take time from Day 13’s buffer — never from authentication, ownership, or draft privacy.

---

## Daily Progress Checklist

- [x] Day 1 — Backend repaired; auth APIs complete
- [x] Day 2 — Client scaffolded; auth UI complete → `phase-1-auth`
- [ ] Day 3 — Post/Tag models; create/read APIs
- [ ] Day 4 — Ownership; edit/delete; tags API
- [ ] Day 5 — Markdown editor + preview + highlighting
- [ ] Day 6 — Post editor + dashboard + feed shell → `phase-2-content`
- [ ] Day 7 — Public feed + search + pagination
- [ ] Day 8 — Tags pages + post detail
- [ ] Day 9 — Profiles + settings + route audit → `phase-3-public`
- [ ] Day 10 — Responsive and UX polish
- [ ] Day 11 — QA, security tests, seed data
- [ ] Day 12 — Deploy backend + frontend
- [ ] Day 13 — Final verification, docs, release → `v1.0.0`
