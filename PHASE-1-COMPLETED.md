# 🎉 Phase 1 COMPLETED - Hashnode Clone MERN Platform

**Status:** ✅ 100% Complete  
**GitHub:** https://github.com/Mainak-2006/hashnode-clone  
**Date:** November 5, 2026

---

## 📊 Phase 1 Summary

This phase established the foundational MERN stack setup for the developer blogging platform, including user authentication, database schema, and project scaffolding.

---

## ✅ Completed Features

### 1. Project Scaffolding
- ✅ Created `server/` and `client/` directories
- ✅ Initialized Node.js project with `npm init -y`
- ✅ Installed core dependencies: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`
- ✅ Set up Vite React frontend setup

### 2. Backend Configuration
- ✅ `server/index.js` - Main Express entry point with MongoDB connection
- ✅ `server/.env.example` - Environment variable template
- ✅ `server/.gitignore` - Properly excludes `node_modules/`, `.vscode/`, `.env*`

### 3. User Model & Authentication
- ✅ `server/models/User.js` - Mongoose schema with:
  - Username (unique, trimmed, minlength 3)
  - Email (unique, validated format)
  - Password (minlength 6, hashed with bcryptjs)
  - Profile picture URL, bio (max 200 chars), timestamps
- ✅ Password hashing via `pre('save')` middleware
- ✅ `comparePassword` method for login validation

### 4. Authentication Controllers
- ✅ `server/controllers/authController.js`
  - `register` - Creates new user, returns success message
  - `login` - Verifies credentials, generates JWT token
  - `getCurrentUser` - Protected route placeholder
- ✅ JWT sign with 1-day expiration

### 5. Auth Routes
- ✅ `server/routes/auth.js` - Express router with:
  - `POST /register` - Public endpoint
  - `POST /login` - Public endpoint
  - `GET /me` - Protected endpoint (placeholder)

### 6. Blog Placeholder Routes
- ✅ `server/routes/blogs.js` - Basic CRUD structure
- ✅ Health check route `GET /`

### 7. Git History Management
**Mainak Kundu**
- ✅ Removed `.vscode/` from git tracking
- ✅ Force-pushed clean history to GitHub
- ✅ Updated `.gitignore` with proper entries

### 8. Documentation
- ✅ `README.md` - Comprehensive project documentation
- ✅ `PHASES.md` - 4-phase development roadmap (25%/50%/75%/100%)

---

## 📁 Phase 1 File Structure

```
hashnode-clone/
├── .gitignore              # Git exclusions
├── PHASES.md               # Roadmap (4 phases)
├── README.md               # Project documentation
├── server/                 # Node.js/Express backend
│   ├── index.js            # Server entry point
│   ├── models/User.js      # Mongoose User schema
│   ├── controllers/authController.js  # Auth logic
│   ├── routes/auth.js      # Auth routes
│   ├── routes/blogs.js     # Blog placeholder routes
│   ├── .env.example        # Environment vars template
│   └── package.json        # Server dependencies
├── client/                 # React Vite frontend
│   ├── package.json        # Client dependencies
│   └── ... (pending Phase 2)
└── hashnode-clone.docx     # Original reference document
```

---

## 🛠️ Technical Details

### MongoDB Connection
```javascript
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hashnode-clone')
  .then(() => console.log('📊 MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
```

### User Schema Fields
| Field | Type | Requirements |
|-------|------|-------------|
| `username` | String | Required, unique, minlength: 3 |
| `email` | String | Required, unique, valid email format |
| `password` | String | Required, minlength: 6 |
| `profilePicture` | String | Default: '' |
| `profileBio` | String | Max: 200 characters |
| `createdAt` | Date | Default: Date.now |

### bcryptjs Configuration
- Salt rounds: 10 (industry standard)
- Hashing happens via `pre('save')` middleware
- Comparison via `user.comparePassword(candidatePassword)`

### JWT Configuration
```javascript
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET || 'default_secret',
  { expiresIn: '1d' }
);
```

---

## 🚀 How to Run Phase 1

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas cloud)
- Git

### Installation
```bash
# 1. Clone repository
git clone https://github.com/Mainak-2006/hashnode-clone.git
cd hashnode-clone

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install

# 4. Set up environment variables
cd ../server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 5. Start the server
cd ../server
npm run dev   # or: node index.js
# Server runs on http://localhost:5000

# 6. Start the client (new terminal)
cd client
npm run dev   # Vite dev server
# App runs on http://localhost:5173
```

### API Testing
```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📈 Phase Completion Metrics

| Metric | Value |
|--------|-------|
| **Phase Percentage** | 100% |
| **Commits to GitHub** | 5 |
| **Files Created** | 12+ |
| **Lines of Code** | ~500+ |
| **Dependencies Installed** | 20+ |
| **API Endpoints** | 3 (register, login, me) |
| **Models** | 1 (User) |
| **Git History Cleanup** | ✅ Complete |

---

## 📋 Phase 1 Checklist

- [x] Project scaffolding (server + client folders)
- [x] Express.js backend setup
- [x] MongoDB connection with Mongoose
- [x] User model with bcrypt password hashing
- [x] JWT authentication (sign/verify)
- [x] Registration API endpoint
- [x] Login API endpoint
- [x] Protected route placeholder
- [x] Git initialization and first commit
- [x] GitHub repository push
- [x] Git history cleanup (node_modules, .vscode)
- [x] .gitignore configuration
- [x] README.md documentation
- [x] PHASES.md roadmap
- [x] Blog placeholder routes

---

## 🔄 Transition to Phase 2

**Phase 2 Goals (50% completion):**
- Blog post Mongoose schema creation
- Blog CRUD APIs with JWT protection
- Markdown rendering with `react-markdown`
- Syntax highlighting integration
- Draft saving & publishing functionality
- Blog listing with pagination

**Next Steps:**
1. Proceed to Phase 2 when ready
2. Install `react-markdown` and syntax highlighter in client
3. Create Blog model, controller, and routes
4. Build Markdown editor/preview components
5. Commit and push to GitHub

---

## 👤 Author

*****REMOVED*****  
MERN Stack Developer  
Portfolio: https://github.com/Mainak-2006  
Inspired by: [Hashnode](https://hashnode.com)

---
*Phase 1 Complete — Ready for Phase 2: Blog CRUD & Markdown Features*