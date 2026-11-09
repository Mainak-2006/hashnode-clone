# Phase 2 — Blog CRUD & Markdown ✅

**Status:** Complete  
**Date:** November 9, 2026  
**Plan:** Days 3–6 of the 13-day roadmap (`PHASES.md`)  
**Milestone tag:** `phase-2-content`

---

## Summary

Phase 2 turns the authenticated shell into a working blogging product. Authors can write Markdown, preview it with GitHub-flavored Markdown and Prism highlighting, save private drafts, publish posts, and manage everything from a dashboard. The API enforces ownership on the server and never exposes drafts through public routes.

---

## What was built

### 1. Content models

- **Post** — `title`, unique `slug`, Markdown `content`, generated `excerpt`, optional `coverImage`, `status` (`draft` | `published`), `author`, and up to five `tags`
- **Tag** — unique lowercased `name` and `slug`
- Slug generation with collision suffixes (`-2`, `-3`, …)
- Markdown-stripped excerpts and a `readingTime` virtual
- Population of author (`name`, `avatarUrl`, `bio`) and tags on post responses

### 2. Post and tag API

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/posts` | Public | Published feed with search, tag filter, and pagination |
| `GET` | `/api/posts/:slug` | Public | Single published post; drafts return `404` |
| `POST` | `/api/posts` | Protected | Create a draft or published post |
| `PUT` | `/api/posts/:id` | Owner | Update a post; non-owner gets `403` |
| `DELETE` | `/api/posts/:id` | Owner | Delete a post; non-owner gets `403` |
| `GET` | `/api/posts/mine` | Protected | All own posts, optionally filtered by status |
| `GET` | `/api/posts/id/:id` | Owner | Load any own post, including drafts |
| `GET` | `/api/tags` | Public | Tags with published-post counts |
| `GET` | `/api/tags/:slug/posts` | Public | Published posts for one tag |

Validation covers missing title/content, invalid status, malformed IDs, non-array or over-limit tags (max 5), and empty updates. Search terms are regex-escaped, and pagination caps `limit` at 50.

### 3. Markdown editor and preview

- `MarkdownEditor` with a formatting toolbar, Write/Preview tabs, word count, and Ctrl/Cmd shortcuts
- `MarkdownPreview` using `react-markdown` + `remark-gfm`
- Prism highlighting with a light build and registered grammars/aliases for JS, TS, JSX/TSX, Python, JSON, Bash, HTML, CSS, YAML, SQL, C/C++, C#, Go, Rust, Ruby, PHP, Markdown, Diff, and Docker
- Per-code-block language label and copy button with a Clipboard API fallback
- Raw HTML is never rendered (`skipHtml`, no `rehype-raw`)

### 4. Post editor

Protected routes `/editor/new` and `/editor/:id` provide:

- Title, Markdown body, cover URL, and tags
- Cover-image preview with load-failure feedback
- Client validation and readable API errors
- Save draft, publish, update, and unpublish actions
- Tag autocomplete from existing tags
- Redirect to the dashboard with a success notice

### 5. Dashboard

Protected `/dashboard` shows:

- Author greeting and profile summary
- Total/published/draft counters
- All/published/draft filters
- Edit, view, and delete actions
- Delete confirmation dialog and one-time success notices
- Loading skeletons, empty states, and retryable errors

### 6. Feed foundation

`/feed` renders a responsive paginated card grid with cover image, title, excerpt, author, date, tags, and reading time. Post cards, tag pills, search input, skeletons, empty states, and shared UI primitives were introduced in this phase and completed in Phase 3.

---

## Verification

- Post creation returns `201` with generated slug, excerpt, reading time, and populated relations
- Drafts are absent from the public feed, search, and direct slug lookup (`404`)
- Owner update/delete succeed; non-owner update/delete → `403`; anonymous → `401`
- Unique slugs are generated for duplicate titles, and renaming retires the old slug
- Tag find-or-create, dedupe, lowercasing, clearing, published-only counts, and unknown-tag `404`
- Markdown rendering verified for headings, emphasis, links, blockquotes, nested lists, task lists, GFM tables, and fenced code
- Raw HTML remains inert
- Client production build succeeds

---

## How to run

```bash
npm install --prefix server
npm install --prefix client

cp server/.env.example server/.env
# Set JWT_SECRET and either MONGO_URI or USE_MEMORY_DB=true

cd server && npm run dev      # API on :5000
cd client && npm run dev      # UI on :5173
```

Sign in, open `/editor/new`, write Markdown, save a draft, then publish it from the dashboard.

---

## Notes

- Comments, likes, follows, image uploads, and dark mode remain intentionally out of scope.
- Phase 3 completes search, tag pages, post detail, and profiles.

---

## Author

**Mainak Kundu** — [GitHub](https://github.com/Mainak-2006)
