# Hashnode Clone - Development Phases

This project is a full-stack developer blogging platform inspired by Hashnode, built with the MERN stack. Development is split into progressive phases, with milestone commits to GitHub at each stage.

## Phase Overview

| Phase | Target Completion | Description |
|-------|-------------------|-------------|
| **Phase 1** | 25% | Project scaffolding, backend setup, authentication routes, database schema, user registration & login |
| **Phase 2** | 50% | Blog CRUD operations, Markdown rendering, tag system, draft management, protected routes |
| **Phase 3** | 75% | Author profiles, public developer feed, tag-based filtering, search functionality, syntax highlighting |
| **Phase 4** | 100% | Responsive UI polish, fine-tuning, bug fixes, deployment setup |

## Phase 1 - Scaffolding & Authentication (25%)

### Goals
- Initialize monorepo or separate server/client folders
- Set up Node.js/Express backend with Mongoose & MongoDB
- Implement JWT authentication (sign/verify)
- Hash passwords with bcryptjs
- Create User model & validation
- Register & login APIs with response tokens
- Basic error handling & validation
- GitHub commit after completing 25%

### Key Files/Directories
- `server/` - Express backend
- `server/models/User.js` - Mongoose User schema
- `server/routes/auth.js` - Auth routes
- `server/controllers/authController.js` - Auth logic
- `client/` - React Vite frontend
- `client/src/` - React components & pages
- `.gitignore` - Exclude node_modules, env, etc.

### Commands to Run
```bash
# Backend
cd server
npm init -y
npm install express mongoose jwtbcryptjs cors dotenv
# Frontend
cd ../client
npm create vite@latest -- --template react
npm install react react-dom react-router-dom axios
```

---

## Phase 2 - Blog CRUD & Markdown (50%)

### Goals
- Create Blog post model (title, content, tags, author ref, draft status)
- Implement blog CRUD APIs (create, read, update, delete)
- Protect routes with JWT middleware
- Render Markdown content on frontend using React Markdown
- Syntax highlighting integration (PrismJS or highlight.js)
- Draft saving & publishing toggle
- Blog listing with pagination

### Key Additions
- `server/models/Blog.js` - Mongoose Blog schema
- `server/routes/blog.js` - Blog routes (protected)
- `server/controllers/blogController.js` - Blog logic
- `client/src/components/MarkdownEditor.js` - Markdown editor
- `client/src/components/MarkdownPreview.js` - Preview with syntax highlight
- Updated context for auth state

### Commands to Run
```bash
# Install additional deps
cd client
npm install react-markdown rehype-prism or highlight.js
```

---

## Phase 3 - Tags, Filtering, Search & Profiles (75%)

### Goals
- Technology tag system (chip tags, autocomplete)
- Tag-based filtering on blog listing
- Search functionality (title + content)
- Author profile page (editable profile, follower count)
- Public developer feed (latest posts from all users)
- Comments (optional stretch goal)

### Key Additions
- `server/models/Tag.js` or tag reference in Blog schema
- `server/utils/search.js` - Search algorithm
- `client/src/components/TagChip.js` - Interactive tag component
- `client/src/pages/ProfilePage.js` - User profile
- `client/src/pages/FeedPage.js` - Public feed
- API endpoints for search, filter, profile data

---

## Phase 4 - Polish & Deployment (100%)

### Goals
- Responsive design for mobile/tablet/desktop
- Global error handling & validation messages
- Loading & empty states
- Deployment to Vercel (frontend) + Render/Heroku (backend) or MongoDB Atlas
- Final bug squashing
- README documentation

### Commands
```bash
# Deploy
vercel --prod   # frontend
# backend deployment depends on chosen platform
```