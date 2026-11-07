# Phase 1 — Foundation & Authentication ✅

**Status:** Complete  
**Date:** November 7, 2026  
**Plan:** Days 1–2 of the 13-day roadmap (`PHASES.md`)  
**Milestone tag:** `phase-1-auth`

---

## Summary

Phase 1 delivers a working authentication foundation for the Hashnode Clone: an Express/Mongoose API with bcrypt password hashing and JWT sessions, plus a React/Vite client with persisted login, protected routes, and a responsive app shell.

The earlier placeholder backend (`username`/`profilePicture`, `/api/blogs`, a non-functional `/me`) was replaced with the PRD-aligned structure before the client was built.

---

## What was built

### 1. Backend structure (PRD-aligned)

```text
server/
├── config/db.js
├── controllers/authController.js
├── middleware/authMiddleware.js
├── middleware/errorMiddleware.js
├── models/User.js
├── routes/authRoutes.js
├── utils/ApiError.js
├── utils/asyncHandler.js
├── utils/generateToken.js
├── seed/seed.js
├── .env.example
├── server.js
└── package.json
```

- `server.js` — Express app, CORS, JSON parsing, health routes, startup, graceful shutdown
- `config/db.js` — MongoDB connection with an optional in-memory fallback (`USE_MEMORY_DB=true`)
- `middleware/errorMiddleware.js` — centralized `400/401/403/404/500` responses, Mongoose and duplicate-key handling
- `utils/generateToken.js` — JWT signing with `{ id }` payload and configurable expiry

### 2. User model

| Field | Type | Rules |
|---|---|---|
| `name` | String | Required, 2–60 chars, trimmed |
| `email` | String | Required, unique, lowercase, validated format |
| `password` | String | Required, min 6 chars, `select: false`, bcrypt-hashed |
| `bio` | String | Optional, max 200 chars |
| `avatarUrl` | String | Optional |
| `createdAt` / `updatedAt` | Date | Mongoose timestamps |

- `pre('save')` hashes the password with **bcryptjs, 12 salt rounds**
- `comparePassword()` verifies credentials
- `toJSON()` exposes `id`, removes `_id`, `__v`, and `password`

### 3. Authentication API

| Method | Endpoint | Access | Behavior |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Validates input, rejects duplicate email, returns `201 { message, token, user }` |
| `POST` | `/api/auth/login` | Public | Verifies credentials, returns `{ message, token, user }` |
| `GET` | `/api/auth/me` | Private | Returns `{ user }` for a valid bearer token |
| `GET` | `/api/health` | Public | Reports API and database status |
| `GET` | `/` | Public | API metadata |

Auth errors are consistent:

- Missing fields → `400`
- Duplicate email → `400`
- Wrong email/password → `401`
- Missing/expired/invalid token → `401`
- Unknown route → `404`
- Unhandled error → `500`

### 4. Client structure

```text
client/
├── src/
│   ├── api/axios.js             # JWT request interceptor + 401 response handling
│   ├── components/
│   │   ├── auth/AuthLayout.jsx
│   │   ├── layout/Layout.jsx
│   │   ├── layout/Navbar.jsx
│   │   ├── layout/Footer.jsx
│   │   ├── layout/ProtectedRoute.jsx
│   │   ├── ui/Avatar.jsx
│   │   ├── ui/ErrorMessage.jsx
│   │   ├── ui/LoadingSpinner.jsx
│   │   └── Brand.jsx
│   ├── context/AuthContext.jsx
│   ├── hooks/useAuth.js
│   ├── hooks/useDocumentTitle.js
│   ├── pages/Home.jsx
│   ├── pages/Login.jsx
│   ├── pages/Register.jsx
│   ├── pages/Dashboard.jsx
│   ├── pages/NotFound.jsx
│   ├── styles/global.css
│   ├── utils/errors.js
│   ├── App.jsx
│   └── main.jsx
├── public/favicon.svg
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

### 5. Client behavior

- **AuthContext** owns `user`, `token`, `initializing`, `isAuthenticated`, `register`, `login`, `logout`, `updateUser`
- Session restored on load via `GET /api/auth/me`
- Token persisted under **`hashnode_token`** in localStorage
- Axios attaches the bearer token and clears it on `401` (except login/register)
- **ProtectedRoute** shows a restore spinner, then redirects to `/login` with the intended path
- **Login/Register** include field validation, password visibility toggles, pending states, and readable API errors
- **Dashboard** greets the authenticated user and shows account details
- **Navbar** is responsive with a mobile menu, user avatar, and logout
- **Home** is a branded landing page with feature and roadmap sections
- **404** page and skip-to-content link included
- Responsive layout verified at 1280, 1024, 768, and 390 px

---

## Verification performed

### API matrix (curl)

| Case | Result |
|---|---|
| Register new user | `201`, token + sanitized user |
| Register duplicate email | `400` |
| Login correct credentials | `200`, token + user |
| Login wrong password | `401` |
| `GET /me` with token | `200`, user |
| `GET /me` without token | `401` |
| `GET /me` with invalid token | `401` |
| Register with missing fields | `400` |
| Unknown route | `404` |
| Health check | `200`, database connected |

### Password storage

| Check | Result |
|---|---|
| Stored value is plaintext | ❌ No |
| Stored value matches bcrypt format | ✅ Yes |
| `bcrypt.compare` succeeds | ✅ Yes |
| `password` leaked in JSON | ❌ No |
| `id` exposed in JSON | ✅ Yes |

### Browser flow (headless Chromium)

All 20 checks passed:

- Home renders with correct title and hero
- Register redirects to `/dashboard`
- Token persisted; dashboard greets the user
- Session survives refresh
- Logout clears token and returns home
- `/dashboard` while logged out redirects to `/login`
- Invalid login shows a readable error and stays on the page
- Successful login redirects back to the intended page
- Client validation shows all four field errors
- Invalid stored token redirects to login and is cleared
- Mobile menu opens and exposes navigation links
- 404 page renders
- No unexpected console/page errors

### Layout

44/44 checks passed across `/`, `/login`, `/register`, `/dashboard`, and `/nope` at 1280, 1024, 768, and 390 px:

- No horizontal overflow
- Tap targets ≥ 32 px
- Auth split panel on desktop, stacked on mobile

### Build

```bash
npm run build --prefix client
```

Completed successfully (Vite 6, ~258 kB JS / ~19 kB CSS before gzip).

---

## How to run

```bash
# Install
npm install --prefix server
npm install --prefix client

# Configure
cp server/.env.example server/.env
# Set JWT_SECRET and either MONGO_URI or USE_MEMORY_DB=true

# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Open <http://localhost:5173>.

Optional demo user (requires a shared/real MongoDB):

```bash
cd server && npm run seed
# demo@hashnode.dev / password123
```

---

## Notes and limitations

- Phase 1 auth only; no posts, tags, feed, search, or profile editing yet.
- In-memory DB data is lost on restart.
- The client build is not deployed yet — deployment is Phase 4.
- Stretch features (comments, likes, follows, uploads, dark mode) are intentionally deferred.

---

## Next: Phase 2 (Days 3–6)

- `Post` and `Tag` models
- Create/read/update/delete APIs with server-side ownership checks
- Slugs, excerpts, reading time, and draft privacy
- Markdown editor, preview, and syntax highlighting
- Post editor, dashboard management, and a paginated feed shell

See [`PHASES.md`](./PHASES.md) for the full schedule.

---

## Author

**Mainak Kundu** — [GitHub](https://github.com/Mainak-2006)

*Phase 1 complete — authentication foundation ready for content features.*
