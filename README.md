# Hashnode Clone — MERN Developer Blogging Platform

A developer-first blogging platform inspired by [Hashnode](https://hashnode.com), built with the MERN stack. The authentication foundation and the **content API (Post + Tag)** are complete; Markdown editing and the public UI follow in the remaining phases of the 13-day plan (see [`PHASES.md`](./PHASES.md)).

> **Status:** Phase 1 complete. Phase 2 Days 3–4 complete — Post/Tag models, CRUD, ownership checks, slugs, excerpts, reading time, pagination, search, and tag APIs are live.

---

## What works today

- **User registration** — `name`, `email`, and `password` with server-side validation
- **Password security** — bcrypt hashing (12 salt rounds); passwords are never returned by the API
- **JWT authentication** — signed tokens with configurable expiry (`JWT_EXPIRES_IN`, default `7d`)
- **Persisted sessions** — the client stores the token, restores the user via `GET /api/auth/me`, and survives page refreshes
- **Protected routes** — `/dashboard` redirects unauthenticated visitors to `/login` and returns them after login
- **Global 401 handling** — expired or invalid tokens are cleared automatically and the user is signed out
- **React auth UI** — split-screen login/register pages, validation, pending states, readable errors, logout, mobile navigation
- **Post & Tag models** — PRD-aligned schemas with author/tag relationships
- **Post API** — create drafts or published posts, public feed, single post by slug, search, tag filter, and pagination
- **Ownership enforcement** — only the author can update, delete, or load their own drafts (server-side `403`)
- **Draft privacy** — drafts never appear in the public feed, search results, or by direct slug
- **Slugs, excerpts & reading time** — unique slugs with collision suffixes, Markdown-stripped excerpts, and a reading-time virtual
- **Tag API** — find-or-create tags (max 5), published-post counts, and per-tag post lists
- **Consistent API errors** — centralized `400/401/403/404/500` responses
- **Health check** — `GET /api/health` reports server and database status
- **In-memory database option** — run without installing MongoDB by setting `USE_MEMORY_DB=true`

Post CRUD is available through the API. The Markdown editor, feed UI, tag pages, and profiles arrive in Days 5–9.

---

## Tech stack

### Frontend
- **React 18** + **Vite**
- **React Router** — client-side routing and protected routes
- **Context API** — global auth state (`AuthContext`)
- **Axios** — API client with JWT request/response interceptors
- **lucide-react** — icons

### Backend
- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose**
- **JWT** (`jsonwebtoken`) — signed bearer tokens
- **bcryptjs** — password hashing
- **dotenv**, **cors**

### Development
- **nodemon** — server reload
- **mongodb-memory-server** — zero-install local database for demos and tests

---

## Project structure

```text
hashnode-clone/
├── client/                      # React + Vite frontend
│   ├── public/favicon.svg
│   ├── src/
│   │   ├── api/axios.js         # Axios instance, JWT interceptors, 401 handling
│   │   ├── components/
│   │   │   ├── auth/AuthLayout.jsx
│   │   │   ├── layout/          # Layout, Navbar, Footer, ProtectedRoute
│   │   │   ├── ui/              # Avatar, LoadingSpinner, ErrorMessage
│   │   │   └── Brand.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/               # useAuth, useDocumentTitle
│   │   ├── pages/               # Home, Login, Register, Dashboard, NotFound
│   │   ├── styles/global.css
│   │   ├── utils/errors.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                      # Express API
│   ├── config/db.js             # Mongo connection + memory-DB fallback
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js    # CRUD, ownership, feed, search, pagination
│   │   └── tagController.js     # tags with counts, posts by tag
│   ├── middleware/
│   │   ├── authMiddleware.js    # Bearer JWT verification
│   │   └── errorMiddleware.js   # 404 + centralized errors
│   ├── models/
│   │   ├── User.js              # PRD-aligned User schema
│   │   ├── Post.js              # title, slug, content, excerpt, status, author, tags
│   │   └── Tag.js               # unique name + slug
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   └── tagRoutes.js
│   ├── seed/seed.js             # Demo user seeder
│   ├── utils/                   # token, errors, slugify, excerpt, pagination
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── .gitignore
├── PHASES.md                    # 13-day roadmap
├── PHASE-1-COMPLETED.md         # Phase 1 report
├── hashnode-clone.docx          # Original PRD
└── README.md
```

---

## Getting started

### Prerequisites

- **Node.js 18+** (tested on Node 22)
- **npm**
- **MongoDB** — local or [Atlas](https://www.mongodb.com/atlas), *or* use the bundled in-memory database

### 1. Clone and install

```bash
git clone https://github.com/Mainak-2006/hashnode-clone.git
cd hashnode-clone

npm install --prefix server
npm install --prefix client
```

### 2. Configure the server

```bash
cd server
cp .env.example .env
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

No local MongoDB? Set `USE_MEMORY_DB=true` instead. The server starts a temporary in-memory database — perfect for a demo, but **all data is lost when the server stops**.

### 3. Start both servers

```bash
# Terminal 1 — API on http://localhost:5000
cd server
npm run dev

# Terminal 2 — client on http://localhost:5173
cd client
npm run dev
```

Open <http://localhost:5173>. During development the Vite proxy forwards `/api` requests to the API, so no client env vars are required.

### Demo user (optional)

```bash
cd server
npm run seed
```

This creates or updates:

| Email | Password |
|---|---|
| `demo@hashnode.dev` | `password123` |

> With `USE_MEMORY_DB=true`, the seed script uses its own temporary database, so seed data is not shared with a running in-memory server. Register through the UI, or point both at a real MongoDB instance.

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

### Client (`client/.env`, optional)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `/api` | API base URL. Use `https://your-api/api` in production |

---

## API reference

Base URL: `http://localhost:5000/api`

### `GET /health`

```json
{ "status": "ok", "database": "connected", "timestamp": "2026-11-07T04:17:56.074Z" }
```

### `POST /auth/register`

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"secret123"}'
```

**`201 Created`**

```json
{
  "message": "Account created successfully",
  "token": "<jwt>",
  "user": {
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "bio": "",
    "avatarUrl": "",
    "createdAt": "2026-11-07T04:17:56.109Z",
    "updatedAt": "2026-11-07T04:17:56.109Z",
    "id": "6aeea6743185aaa93d060848"
  }
}
```

Duplicate email → `400`. Missing fields → `400`.

### `POST /auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"secret123"}'
```

Returns `{ message, token, user }`. Wrong credentials → `401`.

### `GET /auth/me` *(protected)*

```bash
curl http://localhost:5000/api/auth/me -H "Authorization: Bearer <jwt>"
```

Returns `{ user }`. Missing or invalid token → `401`.

### Post routes

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/posts` | Public | Published feed, newest first, paginated |
| `GET` | `/api/posts/:slug` | Public | Single published post (drafts → `404`) |
| `POST` | `/api/posts` | Protected | Create a draft or published post |
| `PUT` | `/api/posts/:id` | Protected (owner) | Update a post; non-owner → `403` |
| `DELETE` | `/api/posts/:id` | Protected (owner) | Delete a post; non-owner → `403` |
| `GET` | `/api/posts/mine` | Protected | All of the current user's drafts + published posts |
| `GET` | `/api/posts/id/:id` | Protected (owner) | Load any own post, including drafts |

**Create**

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt>" \
  -d '{
    "title": "Building a REST API with Express",
    "content": "# Hello\\n\\nSome **Markdown** content.",
    "tags": ["express", "mongodb"],
    "coverImage": "https://example.com/cover.png",
    "status": "draft"
  }'
```

**`201 Created`** → `{ message, post }`. The post includes `id`, generated `slug`, generated `excerpt`, `readingTime`, populated `author` (`name`, `avatarUrl`, `bio`), and populated `tags`.

- `status` defaults to `draft`.
- Tags are find-or-create, deduped, and capped at **5** (`400` beyond that).
- Duplicate titles get a unique slug suffix (`-2`, `-3`, …).
- Updating a title regenerates the slug.

**Feed query parameters**

| Param | Example | Behavior |
|---|---|---|
| `search` or `q` | `?search=express` | Case-insensitive title search |
| `tag` | `?tag=mongodb` | Published posts for one tag |
| `page` | `?page=2` | 1-based page (default `1`) |
| `limit` | `?limit=10` | Page size (default `10`, max `50`) |

Response: `{ posts, pagination: { page, limit, total, totalPages, hasMore } }`.

**Own posts**

```bash
GET /api/posts/mine?status=draft
GET /api/posts/id/<postId>
```

`/mine` returns drafts and published posts, optionally filtered by `status`. `/id/:id` is owner-only and is what the editor uses to load a draft.

**Update** accepts any subset of `title`, `content`, `coverImage`, `status`, `tags`. Sending `"tags": null` clears tags. Empty updates → `400`.

**Delete** returns `{ message, id }`.

### Tag routes

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/tags` | Public | All tags with published-post counts |
| `GET` | `/api/tags/:slug/posts` | Public | Published posts under one tag |

```bash
curl http://localhost:5000/api/tags
# { "tags": [{ "id": "...", "name": "mongodb", "slug": "mongodb", "count": 3 }] }
```

Tag counts include published posts only; tags used solely by drafts appear with `count: 0`. Unknown tags on `/api/tags/:slug/posts` → `404`.

### Error format

```json
{ "message": "Human-readable explanation", "errors": ["Optional field errors"] }
```

---

## Available scripts

### Server

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `nodemon server.js` | Development server with reload |
| `npm start` | `node server.js` | Production-style start |
| `npm run seed` | `node seed/seed.js` | Create/update the demo user |

### Client

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `vite` | Dev server with HMR |
| `npm run build` | `vite build` | Production build to `client/dist` |
| `npm run preview` | `vite preview` | Preview the production build |

---

## Auth flow

1. Register or log in; the API returns a signed JWT and the public user object.
2. The client stores the token under the `hashnode_token` localStorage key.
3. Axios attaches `Authorization: Bearer <token>` to every request.
4. On load, `AuthContext` calls `GET /api/auth/me` to restore the session.
5. Any `401` outside login/register clears the token and dispatches an `auth:unauthorized` event, which resets auth state and redirects protected routes to `/login`.
6. Logging out removes the token and clears auth state.

---

## Roadmap

This project follows a 13-day plan. See [`PHASES.md`](./PHASES.md) for daily tasks and gates.

| Phase | Days | Target | Focus | Tag |
|---|---|---|---|---|
| **1 — Foundation & Auth** | 1–2 | 25% | Backend auth, JWT, React auth UI | `phase-1-auth` |
| **2 — CRUD & Markdown** | 3–6 | 50% | Post/Tag models, CRUD, ownership, editor, dashboard | `phase-2-content` |
| **3 — Feed, Search & Profiles** | 7–9 | 75% | Public feed, search, tag pages, post detail, profiles | `phase-3-public` |
| **4 — Polish, QA & Deploy** | 10–13 | 100% | Responsive polish, security QA, deployment, docs | `v1.0.0` |

**Current progress:** Phase 1 complete (tagged `phase-1-auth`). Phase 2 is in progress — Days 3–4 (Post/Tag models and the full content API) are complete; Days 5–6 add the Markdown editor, dashboard, and feed shell before the `phase-2-content` gate.

---

## Verification performed for Phase 2 (Days 3–4)

A 64-check API matrix covers creation, reads, ownership, and tags:

- Create draft/published posts → `201`, with generated slug, Markdown-stripped excerpt, `readingTime`, and populated author/tags
- Drafts hidden from the public feed, search, and `GET /api/posts/:slug` (`404`)
- `GET /api/posts/mine` and owner-only `GET /api/posts/id/:id` (non-owner → `403`, anonymous → `401`)
- Owner update/delete succeed; non-owner update/delete → `403`; bad IDs → `400`
- Validation: missing title/content, invalid status, non-array or empty tags, more than 5 tags → `400`
- Unique slugs for duplicate titles (`-2`, `-3`, …); renaming regenerates the slug and retires the old one
- Case-insensitive slug lookup, `q`/`search` aliases, regex-escaped search, tag filtering, and pagination (`page`, `limit` capped at 50)
- Tag find-or-create, dedupe, lowercasing, `tags: null` clearing, published-only counts, and `404` for unknown tags
- Phase 1 auth endpoints still pass

---

## Verification performed for Phase 1

- Register → `201` with token and sanitized user
- Duplicate email → `400`
- Wrong password → `401`
- Login → token + user
- `/api/auth/me` with/without/invalid token → `200` / `401` / `401`
- Missing fields → `400`; unknown route → `404`
- Stored password confirmed as a bcrypt hash; no `password` in JSON
- Browser flow: register → dashboard, refresh persistence, logout, protected redirect, invalid-login error, redirect-back-after-login, client validation, invalid-token cleanup, mobile menu, 404
- Layout checks at 1280 / 1024 / 768 / 390 px with no horizontal overflow
- `npm run build --prefix client` completes cleanly

---

## Author

**Mainak Kundu** — [GitHub](https://github.com/Mainak-2006)

Inspired by [Hashnode](https://hashnode.com).
