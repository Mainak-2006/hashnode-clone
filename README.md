# Hashnode Clone - MERN Developer Blogging Platform

A full-stack developer blogging platform inspired by Hashnode, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🌟 Features

- **User Authentication**: Secure JWT-based registration and login with bcrypt password hashing
- **Blog CRUD**: Create, read, update, and delete blog posts
- **Markdown Writing**: Write blogs in Markdown with live preview
- **Syntax Highlighting**: Code snippets with automatic syntax highlighting
- **Tag System**: Organize content with technology tags (JavaScript, React, MongoDB, etc.)
- **Tag Filtering**: Filter blogs by technology tags
- **Search Functionality**: Search blogs by title or content
- **Author Profiles**: Personalized author profiles with bio and avatar
- **Public Feed**: Browse latest blogs from all users
- **Draft Management**: Save posts as drafts or publish them
- **Protected Routes**: JWT-authenticated API endpoints
- **Responsive UI**: Works on mobile, tablet, and desktop

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **React Context API** - State management
- **React Markdown** - Markdown rendering
- **Axios** - API requests
- **Vite** - Fast development server and build
- **Highlight.js** or **PrismJS** - Syntax highlighting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Development Tools
- **Git** - Version control
- **GitHub** - Remote repository

## 📁 Project Structure

```
hashnode-clone/
├── client/              # React Vite frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context (Auth)
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/              # Express.js backend
│   ├── index.js         # Server entry point
│   ├── models/          # Mongoose schemas (User, Blog, etc.)
│   ├── routes/          # API routes
│   ├── controllers/     # Route logic
│   ├── .env             # Environment variables
│   └── package.json
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore rules
├── PHASES.md            # Development roadmap with 4 phases
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mainak-2006/hashnode-clone.git
   cd hashnode-clone
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create `.env` in the server directory:
   ```bash
   cd ../server
   cp .env.example .env
   # Edit .env with your config
   ```

   **`.env.example`** contents:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hashnode-clone
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   ```

5. **Start the development servers**

   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev   # or: node index.js

   # Terminal 2 - Frontend
   cd client
   npm run dev   # Vite dev server
   ```

6. **Open your browser**
   Visit `http://localhost:5173` (Vite default) or `http://localhost:3000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /me` - Get current user profile (protected)

### Blog Routes (`/api/blogs`)
- `GET /` - Get all blogs (public)
- `GET /:id` - Get single blog by ID
- `POST /` - Create new blog (protected)
- `PUT /:id` - Update blog (protected)
- `DELETE /:id` - Delete blog (protected)

## 🏗️ Development Roadmap

See **PHASES.md** for the 4-phase development plan:

| Phase | Target | Features |
|-------|--------|----------|
| **Phase 1** | 25% | Scaffolding, auth routes, User model, MongoDB connection |
| **Phase 2** | 50% | Blog CRUD, Markdown rendering, syntax highlighting, drafts |
| **Phase 3** | 75% | Tag system, filtering, search, author profiles, public feed |
| **Phase 4** | 100% | Polish, responsive design, deployment, bug fixes |

Current progress: **Phase 1 Complete** - Scaffolding, authentication, and database schema implemented and pushed to GitHub.

## 📦 Available Scripts

### Server (`server/package.json`)
```json
{
  "scripts": {
    "dev": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### Client (`client/package.json`)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👤 Author

**Mainak Kundu** - [GitHub](https://github.com/Mainak-2006)

---