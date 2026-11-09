# Hashnode Clone — MERN Developer Blogging Platform

A developer-first blogging platform inspired by [Hashnode](https://hashnode.com), built with the MERN stack. Authors write in Markdown, publish code-heavy articles, and manage everything from a dashboard. Visitors can browse a paginated feed, search by title, explore tags, read full posts, and view public author profiles.

> **Status:** v1.0.0 — all 13 roadmap days are implemented. Auth, content CRUD, ownership, draft privacy, Markdown/GFM/Prism rendering, feed search, tags, post detail, profiles, settings, responsive polish, QA, and deployment configuration are complete. See [`PHASES.md`](./PHASES.md) and the phase reports.

---

## Features

### Reading and discovery

- **Public feed** — newest-first responsive card grid with cover image, title, excerpt, author, date, tags, and reading time
- **Title search** — debounced `?q=` search with a clear-search state
- **Pagination** — “Load more” with loading, empty, and retryable error states
- **Tag directory** — every tag with its published-post count and client-side filtering
- **Tag pages** — paginated published posts, related tags, and empty states
- **Article detail** — full Markdown, cover image, author card, tag links, and copy-link
- **Public profiles** — author header and published posts only
- **Safe rendering** — raw HTML is never rendered; GFM tables, task lists, and code fences work

### Writing and authoring

- **Markdown editor** — formatting toolbar, Write/Preview tabs, word count, and Ctrl/Cmd shortcuts
- **GitHub-flavored Markdown** — tables, task lists, strikethrough, and more
- **Syntax highlighting** — Prism with common languages and fence aliases
- **Copy-code buttons** — per fenced block, with a Clipboard API fallback
- **Post editor** — title, Markdown body, cover URL, and up to five tags
- **Draft/publish workflow** — save drafts, publish, update, and unpublish
- **Dashboard** — all/published/draft filters, counters, edit, view, and delete with confirmation
- **Profile settings** — update name, bio, and avatar URL with validation

### Security and platform

- **bcrypt password hashing** — 12 salt rounds; passwords are never returned
- **JWT authentication** — configurable expiry, persisted sessions, and `/auth/me` restoration
- **Server-side ownership** — only the author can update, delete, or load their own drafts
- **Draft privacy** — drafts never appear in the feed, search, tag pages, profiles, or by direct slug
- **Global 401 handling** — invalid or expired tokens are cleared and protected routes redirect
- **Consistent API errors** — centralized `400/401/403/404/500` responses
- **Health check** — `/api/health` reports API and database status
- **In-memory database option** — run without installing MongoDB
- **Repeatable QA** — 74-check API smoke suite against an in-memory MongoDB

---

## Tech stack

### Frontend

- **React 18** + **Vite**
- **Tailwind CSS v4**
- **React Router** — client routing and protected routes
- **Context API** — auth state (`AuthContext`)
- **Axios** — JWT request/response interceptors
- **react-markdown** + **remark-gfm** — Markdown and GFM
- **react-syntax-highlighter** — Prism highlighting
- **lucide-react** — icons

### Backend

- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose**
- **JWT** (`jsonwebtoken`)
- **bcryptjs**
- **dotenv**, **cors**

### Development and deployment

- **nodemon** — server reload
- **mongodb-memory-server** — zero-install database for tests/demos
- **Render** — backend blueprint (`render.yaml`)
- **Vercel** / **Netlify** — SPA configuration included

---

## Project structure

```text
hashnode-clone/
├── client/
│   ├── public/favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js           # Axios instance, JWT interceptors, 401 handling
│   │   │   ├── posts.js
│   │   │   ├── tags.js
│   │   │   └── users.js
│   │   ├── components/
│   │   │   ├── auth/AuthLayout.jsx
│   │   │   ├── layout/            # Layout, Navbar, Footer, ProtectedRoute
│   │   │   ├── markdown/          # Editor, preview, commands, languages
│   │   │   ├── posts/             # PostCard, PostList, SearchBar, TagInput, TagPill
│   │   │   ├── ui/                # Avatar, ConfirmDialog, EmptyState, Notice, Skeleton, …
│   │   │   └── Brand.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/                 # useAuth, useDocumentTitle
│   │   ├── pages/                 # Home, Feed, PostDetail, Tags, TagPage, Profile, Settings,
│   │   │                          # Dashboard, PostEditor, Login, Register, MarkdownPlayground, NotFound
│   │   ├── styles/tailwind.css
│   │   ├── utils/                 # errors, clipboard, format
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── netlify.toml
│   ├── vercel.json
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── tagController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/                    # User, Post, Tag
│   ├── routes/                    # auth, posts, tags, users
│   ├── seed/seed.js               # 3 authors, 8 published posts, 1 private draft
│   ├── test/smoke.js              # 74-check API smoke suite
│   ├── utils/                     # token, errors, slugify, excerpt, pagination, populate
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── .gitignore
├── PHASES.md                      # 13-day roadmap
├── PHASE-1-COMPLETED.md
├── PHASE-2-COMPLETED.md
├── PHASE-3-COMPLETED.md
├── PHASE-4-COMPLETED.md
├── render.yaml                    # Render backend blueprint
├── hashnode-clone.docx            # Original PRD
└── README.md
```

---

## Getting started

### Prerequisites

- **Node.js 18+** (tested on Node 22)
- **npm**
- **MongoDB** — local or [Atlas](https://www.mongodb.com/atlas), *or* the bundled in-memory database

### 1. Clone and install

```bash
git clone https://github.com/Mainak-2006/hashnode-clone.git
cd hashnode-clone

npm install --prefix server
npm install --prefix client
```

### 2. Configure the server

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hashnode-clone
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
USE_MEMORY_DB=false
```

No local MongoDB? Set `USE_MEMORY_DB=true`. The server starts a temporary in-memory database — ideal for a demo, but **all data is lost when the process stops**.

### 3. Seed demo content (optional)

```bash
npm run seed --prefix server
```

This creates or updates **3 authors**, **8 published posts**, and **1 private draft**.

| User | Email | Password |
|---|---|---|
| Demo Author | `demo@hashnode.dev` | `password123` |
| Ada Lovelace | `ada@hashnode.dev` | `password123` |
| Grace Hopper | `grace@hashnode.dev` | `password123` |

> With `USE_MEMORY_DB=true`, the seed process uses its own temporary database, so data is not shared with a separately running server. Register through the UI or point both at a real MongoDB instance.

### 4. Start both servers

```bash
# Terminal 1 — API on http://localhost:5000
npm run dev --prefix server

# Terminal 2 — client on http://localhost:5173
npm run dev --prefix client
```

Open <http://localhost:5173>. During development, Vite proxies `/api` to the API, so no client environment variables are required.

### 5. Run the QA suite

```bash
npm run test:api --prefix server
```

Expected result: **74 passed, 0 failed**.

### 6. Build for production

```bash
npm run build --prefix client
npm run preview --prefix client
```

---

## Client routes

| Route | Access | Page |
|---|---|---|
| `/` | Public | Landing page |
| `/feed` | Public | Feed, search, and load-more pagination |
| `/posts/:slug` | Public | Full article |
| `/tags` | Public | Tag directory |
| `/tags/:slug` | Public | Posts for one tag |
| `/u/:id` | Public | Public author profile |
| `/login` | Public | Log in |
| `/register` | Public | Create account |
| `/dashboard` | Protected | Author dashboard |
| `/editor/new` | Protected | Create a post |
| `/editor/:id` | Protected | Edit a post |
| `/settings` | Protected | Profile settings |
| `/markdown` | Protected | Markdown playground |
| `/404` and `*` | Public | Not found |

Protected routes redirect unauthenticated visitors to `/login` and return them to the intended page after login.

---

## Environment variables

### Server (`server/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | `development` or `production` |
| `PORT` | No | `5000` | API port |
| `MONGO_URI` | No* | `mongodb://127.0.0.1:27017/hashnode-clone` | MongoDB connection string |
| `JWT_SECRET` | Yes† | — | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | No | `7d` | Token lifetime (any `jsonwebtoken` duration) |
| `CLIENT_URL` | No | *(allow all)* | Comma-separated allowed browser origins |
| `USE_MEMORY_DB` | No | `false` | `true` starts an in-memory MongoDB |

\* Required in practice unless `USE_MEMORY_DB=true`.
† In development an insecure fallback is used with a warning; in production the server refuses to start without it.

### Client (`client/.env`, optional in development)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `/api` | API base URL. Production example: `https://your-api.onrender.com/api` |

---

## Available scripts

### Server

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `nodemon server.js` | Development server with reload |
| `npm start` | `node server.js` | Production-style start |
| `npm run seed` | `node seed/seed.js` | Create/update demo authors, posts, and draft |
| `npm run test` | `node test/smoke.js` | Alias for the API smoke suite |
| `npm run test:api` | `node test/smoke.js` | 74-check API smoke suite |

### Client

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `vite` | Dev server with HMR |
| `npm run build` | `vite build` | Production build to `client/dist` |
| `npm run preview` | `vite preview` | Preview the production build locally |

---

## API reference

Base URL: `http://localhost:5000/api`

### Health

```http
GET /api/health
```

```json
{ "status": "ok", "database": "connected", "timestamp": "2026-11-09T08:10:27.865Z" }
```

### Auth

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create an account → `{ message, token, user }` |
| `POST` | `/api/auth/login` | Public | Log in → `{ message, token, user }` |
| `GET` | `/api/auth/me` | Protected | Restore the current session → `{ user }` |

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"secret123"}'
```

Duplicate email → `400`. Wrong credentials → `401`. Missing/invalid token → `401`.

### Posts

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/posts` | Public | Published feed, newest first, paginated |
| `GET` | `/api/posts/:slug` | Public | Single published post; drafts → `404` |
| `POST` | `/api/posts` | Protected | Create a draft or published post |
| `PUT` | `/api/posts/:id` | Owner | Update a post; non-owner → `403` |
| `DELETE` | `/api/posts/:id` | Owner | Delete a post; non-owner → `403` |
| `GET` | `/api/posts/mine` | Protected | All current-user posts, optional `?status=` |
| `GET` | `/api/posts/id/:id` | Owner | Load any own post, including drafts |

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt>" \
  -d '{
    "title": "Building a REST API with Express",
    "content": "# Hello\n\nSome **Markdown** content.",
    "tags": ["express", "mongodb"],
    "coverImage": "https://example.com/cover.png",
    "status": "draft"
  }'
```

Feed query parameters:

| Param | Example | Behavior |
|---|---|---|
| `search` or `q` | `?search=express` | Case-insensitive title search |
| `tag` | `?tag=mongodb` | Published posts for one tag |
| `page` | `?page=2` | 1-based page (default `1`) |
| `limit` | `?limit=10` | Page size (default `10`, max `50`) |

Response: `{ posts, pagination: { page, limit, total, totalPages, hasMore } }`.

Post behavior:

- `status` defaults to `draft`.
- Tags are find-or-create, deduped, lowercased, and capped at **5** (`400` beyond that).
- Duplicate titles get a unique slug suffix (`-2`, `-3`, …); renaming regenerates the slug.
- Excerpts strip Markdown; `readingTime` is a virtual.
- Sending `"tags": null` clears tags; empty updates → `400`.

### Tags

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/tags` | Public | All tags with published-post counts |
| `GET` | `/api/tags/:slug/posts` | Public | Published posts for one tag |

Tag counts include published posts only. Tags used solely by drafts appear with `count: 0`. Unknown tags on `/api/tags/:slug/posts` → `404`.

### Users

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/users/:id` | Public | Public user fields + published posts only |
| `PUT` | `/api/users/me` | Protected | Update `name`, `bio`, and `avatarUrl` |

Public profiles expose only `name`, `avatarUrl`, `bio`, and `createdAt`; email and password are never returned. Invalid IDs → `400`, unknown users → `404`, empty updates → `400`.

### Error format

```json
{ "message": "Human-readable explanation", "errors": ["Optional field errors"] }
```

---

## Auth flow

1. Register or log in; the API returns a signed JWT and a sanitized user object.
2. The client stores the token under the `hashnode_token` localStorage key.
3. Axios attaches `Authorization: Bearer <token>` to every request.
4. On load, `AuthContext` calls `GET /api/auth/me` to restore the session.
5. Any `401` outside login/register clears the token and dispatches an `auth:unauthorized` event, which resets auth state and redirects protected routes to `/login`.
6. Logging out removes the token and clears auth state.

---

## Deployment

### 1. MongoDB Atlas

Create a cluster and database user, allow the backend host's IP (or `0.0.0.0/0` for a demo), and copy the connection string into `MONGO_URI`.

### 2. Backend — Render

The included [`render.yaml`](./render.yaml) blueprint creates a Node web service rooted at `server/`:

- Build: `npm ci`
- Start: `npm start`
- Health check: `/api/health`
- Env: `NODE_ENV=production`, `JWT_SECRET` (generated), `MONGO_URI`, `CLIENT_URL`, `JWT_EXPIRES_IN=7d`

Set `CLIENT_URL` to the deployed frontend origin. Multiple origins can be comma-separated. Railway or any Node host works with the same build/start commands.

### 3. Frontend — Vercel or Netlify

The client includes both configurations:

- [`client/vercel.json`](./client/vercel.json) — `npm run build`, output `dist`, SPA rewrite
- [`client/netlify.toml`](./client/netlify.toml) — `npm run build`, publish `dist`, SPA redirect

Set the environment variable:

```env
VITE_API_URL=https://your-api-host.example.com/api
```

Then deploy the `client/` directory. SPA rewrites make direct loads such as `/posts/my-slug` work after a hard refresh.

### 4. Live smoke test

1. `/api/health` → `{ "status": "ok", "database": "connected" }`
2. Register and log in on the live client
3. Publish a post and open it from the feed
4. Search, open a tag page, and view a profile
5. Confirm the private seed draft is absent everywhere public
6. Edit and delete the test post as its owner
7. Hard-refresh a deep link and confirm the SPA rewrite works

---

## QA and verification

### API smoke suite

```bash
npm run test:api --prefix server
# 74 passed, 0 failed
```

Covered areas:

- Auth: register, duplicate email, login, wrong password, `/me`, missing/invalid tokens
- Post CRUD: create draft/published, validation, slugs, update, delete
- Ownership: non-owner update/delete → `403`; anonymous → `401`
- Draft privacy: absent from feed, search, tag pages, profiles, and direct slug (`404`)
- Search and pagination: `q`/`search`, regex escaping, page/limit caps
- Tags: find-or-create, dedupe, max five, counts, unknown tag `404`
- Profiles: safe public fields, published posts only, update validation, invalid IDs
- Errors: malformed JSON → `400`, unknown route → `404`
- Passwords: bcrypt hashes only, never serialized

### Production build

```bash
npm run build --prefix client
```

The app builds into split chunks: app (`~220 kB`), Markdown (`~169 kB`), React/router (`~166 kB`), and syntax highlighting (`~106 kB`), with no chunk-size warning.

### Manual UI checklist

- Responsive layouts at desktop, tablet, and 480 px
- Mobile navigation opens, closes on route change/Escape, and exposes all links
- Protected routes redirect when signed out and return after login
- Feed search, clear search, load more, empty state, and error state
- Tag directory filtering and tag pages
- Article Markdown, tables, code blocks, copy-code, copy-link, owner actions
- Profile, settings save, navbar identity refresh, and logout
- Direct deep-link load in the production preview

---

## Roadmap

| Phase | Days | Target | Focus | Tag |
|---|---|---|---|---|
| **1 — Foundation & Auth** | 1–2 | 25% | Backend auth, JWT, React auth UI | `phase-1-auth` |
| **2 — CRUD & Markdown** | 3–6 | 50% | Post/Tag models, CRUD, ownership, editor, dashboard | `phase-2-content` |
| **3 — Feed, Search & Profiles** | 7–9 | 75% | Public feed, search, tag pages, post detail, profiles | `phase-3-public` |
| **4 — Polish, QA & Deploy** | 10–13 | 100% | Responsive polish, QA, deployment, docs | `v1.0.0` |

All phases are implemented. See [`PHASES.md`](./PHASES.md) for the day-by-day record and the phase reports for verification details:

- [`PHASE-1-COMPLETED.md`](./PHASE-1-COMPLETED.md)
- [`PHASE-2-COMPLETED.md`](./PHASE-2-COMPLETED.md)
- [`PHASE-3-COMPLETED.md`](./PHASE-3-COMPLETED.md)
- [`PHASE-4-COMPLETED.md`](./PHASE-4-COMPLETED.md)

---

## Notes and limitations

- Live hosting requires the owner's MongoDB Atlas, Render/Railway, and Vercel/Netlify credentials; deployment configuration is ready.
- In-memory MongoDB is for demos and tests only — data is lost on restart.
- Stretch goals (comments, likes/reactions, follows, image uploads, infinite scroll, elaborate dark mode) are intentionally out of scope for v1.0.0.

---

## Author

**Mainak Kundu** — [GitHub](https://github.com/Mainak-2006)

Inspired by [Hashnode](https://hashnode.com).
