import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostEditor from './pages/PostEditor';
import PostDetail from './pages/PostDetail';
import Tags from './pages/Tags';
import TagPage from './pages/TagPage';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import MarkdownPlayground from './pages/MarkdownPlayground';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="feed" element={<Feed />} />
        <Route path="posts/:slug" element={<PostDetail />} />
        <Route path="tags" element={<Tags />} />
        <Route path="tags/:slug" element={<TagPage />} />
        <Route path="u/:id" element={<Profile />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="editor/new"
          element={
            <ProtectedRoute>
              <PostEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="editor/:id"
          element={
            <ProtectedRoute>
              <PostEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="markdown"
          element={
            <ProtectedRoute>
              <MarkdownPlayground />
            </ProtectedRoute>
          }
        />

        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
