# Hashnode Clone — MERN Developer Blogging Platform

A developer-first blogging platform inspired by [Hashnode](https://hashnode.com), built with the MERN stack. This repository currently contains **Phase 1: the authentication foundation** of a 13-day build plan (see [`PHASES.md`](./PHASES.md)).

> **Status:** Phase 1 complete — registration, login, persisted JWT sessions, protected routes, and the React app shell all work end to end.

---

## What works today

- **User registration** — `name`, `email`, and `password` with server-side validation
- **Password security** — bcrypt hashing (12 salt rounds); passwords are never returned by the API
- **JWT authentication** — signed tokens with configurable expiry (`JWT_EXPIRES_IN`, default `7d`)
- **Persisted sessions** — the client stores the token, restores the user via `GET /api/auth/me`, and survives page refreshes
- **Protected routes** — `/dashboard` redirects unauthenticated visitors to `/login` and returns them after login
- **Global 401 handling** — expired or invalid tokens are cleared automatically and the user is signed out
- **React auth UI** — split-screen login/register pages, validation, pending states, readable errors, logout, mobile navigation
- **Consistent API errors** — centralized `400/401/403/404/500` responses
- **Health check** — `GET /api/health` reports server and database status
- **In-memory database option** — run without installing MongoDB by setting `USE_MEMORY_DB=true`

Post CRUD, Markdown editing, tags, feed, search, and profiles arrive in Phases 2–4.

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
│   ├── controllers/authController.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # Bearer JWT verification
│   │   └── errorMiddleware.js   # 404 + centralized errors
│   ├── models/User.js           # PRD-aligned User schema
│   ├── routes/authRoutes.js
│   ├── seed/seed.js             # Demo user seeder
│   ├── utils/                   # generateToken, ApiError, asyncHandler
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
