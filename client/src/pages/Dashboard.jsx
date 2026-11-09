import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Eye,
  FileText,
  LogOut,
  PenSquare,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import Notice from '../components/ui/Notice';
import Skeleton from '../components/ui/Skeleton';
import { deletePost, getMyPosts } from '../api/posts';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getErrorMessage } from '../utils/errors';
import { formatDate, postPath, readingTimeLabel } from '../utils/format';

const BTN_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-violet-500))] px-5 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-white no-underline shadow-brand transition-all duration-150 hover:-translate-y-px hover:text-white hover:no-underline hover:shadow-brand-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

const BTN_GHOST =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-slate-700 no-underline shadow-soft transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-ink-900 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

const BTN_GHOST_SM =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[0.8rem] font-semibold whitespace-nowrap text-slate-600 no-underline transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-ink-900 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

const FILTERS = [
  { id: 'all', label: 'All posts' },
  { id: 'published', label: 'Published' },
  { id: 'draft', label: 'Drafts' },
];

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.04em] ${
      status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
    }`}
  >
    <span
      className={`size-1.5 rounded-full ${status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`}
      aria-hidden="true"
    />
    {status === 'published' ? 'Published' : 'Draft'}
  </span>
);

function PostRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 p-4 last:border-b-0">
      <Skeleton className="size-16 shrink-0 rounded-xl" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

export default function Dashboard() {
  useDocumentTitle('Dashboard');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [notice, setNotice] = useState(location.state?.notice || '');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { posts: fetched } = await getMyPosts();
      setPosts(fetched || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load your posts.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Consume the one-time notice from the editor without keeping it in history.
  useEffect(() => {
    if (location.state?.notice) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  const counts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((post) => post.status === 'published').length,
      draft: posts.filter((post) => post.status === 'draft').length,
    }),
    [posts]
  );

  const visiblePosts = useMemo(
    () => (filter === 'all' ? posts : posts.filter((post) => post.status === filter)),
    [posts, filter]
  );

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deletePost(deleteTarget.id);
      setPosts((current) => current.filter((post) => post.id !== deleteTarget.id));
      setNotice(`“${deleteTarget.title}” was deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'Could not delete this post.'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 pt-10 pb-[72px] max-md:px-[18px] max-[560px]:pt-6">
      <header className="flex flex-wrap items-start justify-between gap-5 border-b border-slate-200 pb-7 max-[640px]:flex-col">
        <div className="flex items-center gap-4 max-[480px]:items-start">
          <Avatar name={user?.name} src={user?.avatarUrl} size={56} />
          <div>
            <p className="mb-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-brand-600">
              Dashboard
            </p>
            <h1 className="text-[clamp(1.4rem,3vw,1.9rem)] font-extrabold">
              Welcome back, {user?.name?.split(' ')[0] || 'developer'} 👋
            </h1>
            <p className="mt-1 text-[0.9rem] text-slate-500">
              Manage drafts, publish articles, and keep your profile fresh.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/editor/new" className={BTN_PRIMARY}>
            <Plus size={16} aria-hidden="true" />
            New post
          </Link>
          <Link to="/settings" className={BTN_GHOST}>
            <Settings size={16} aria-hidden="true" />
            Settings
          </Link>
          <button type="button" className={BTN_GHOST} onClick={handleLogout}>
            <LogOut size={16} aria-hidden="true" />
            Log out
          </button>
        </div>
      </header>

      <Notice message={notice} className="mt-5" />

      <div className="mt-6 grid grid-cols-3 gap-3 max-[640px]:grid-cols-1">
        {[
          { label: 'Total posts', value: counts.all, icon: FileText },
          { label: 'Published', value: counts.published, icon: TrendingUp },
          { label: 'Drafts', value: counts.draft, icon: PenSquare },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-[16px] border border-slate-200 bg-white p-4 shadow-soft"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[0.76rem] font-medium text-slate-500">{label}</p>
              <p className="text-[1.3rem] font-extrabold leading-tight text-ink-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-7" aria-labelledby="posts-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="posts-heading" className="text-[1.15rem] font-bold">
            Your posts
          </h2>

          <div className="flex flex-wrap gap-1.5 rounded-full border border-slate-200 bg-slate-50 p-1">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`cursor-pointer rounded-full border-0 px-3 py-1.5 text-[0.82rem] font-semibold transition-colors ${
                  filter === item.id
                    ? 'bg-white text-ink-900 shadow-soft'
                    : 'bg-transparent text-slate-500 hover:text-ink-900'
                }`}
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
              >
                {item.label} <span className="text-slate-400">({counts[item.id]})</span>
              </button>
            ))}
          </div>
        </div>

        {deleteError && <ErrorMessage message={deleteError} className="mb-4" />}

        {loading ? (
          <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-soft">
            {Array.from({ length: 4 }).map((_, index) => (
              <PostRowSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadPosts} />
        ) : visiblePosts.length === 0 ? (
          <EmptyState
            icon={filter === 'draft' ? PenSquare : FileText}
            title={
              filter === 'draft'
                ? 'No drafts yet'
                : filter === 'published'
                  ? 'Nothing published yet'
                  : 'Your first post is waiting'
            }
            body={
              filter === 'draft'
                ? 'Save an idea as a draft and come back to it whenever you are ready.'
                : filter === 'published'
                  ? 'Publish a draft to make it visible on the public feed.'
                  : 'Write a technical article in Markdown, add tags, and publish when it is ready.'
            }
            action={
              <Link to="/editor/new" className={BTN_PRIMARY}>
                <Plus size={16} aria-hidden="true" />
                Write a post
              </Link>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-soft">
            <ul className="m-0 list-none p-0">
              {visiblePosts.map((post) => {
                const tags = Array.isArray(post.tags) ? post.tags : [];
                return (
                  <li
                    key={post.id}
                    className="flex flex-wrap items-center gap-4 border-b border-slate-100 p-4 last:border-b-0 max-[640px]:items-start"
                  >
                    <div className="hidden size-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 min-[560px]:block">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt="" className="size-full object-cover" loading="lazy" />
                      ) : (
                        <span className="grid size-full place-items-center bg-[radial-gradient(120px_80px_at_20%_0%,rgba(41,98,255,0.35),transparent_70%),radial-gradient(120px_80px_at_100%_100%,rgba(124,58,237,0.32),transparent_70%)]">
                          <FileText size={20} className="text-white/90" aria-hidden="true" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={post.status} />
                        <span className="text-[0.74rem] text-slate-400">
                          {formatDate(post.updatedAt || post.createdAt)} · {readingTimeLabel(post.readingTime)}
                        </span>
                      </div>
                      <h3 className="mt-1.5 truncate text-[0.98rem] font-bold text-ink-900">
                        {post.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag.id || tag.slug}
                            className="rounded-full bg-slate-100 px-2 py-[2px] text-[0.7rem] font-semibold text-slate-500"
                          >
                            #{tag.name}
                          </span>
                        ))}
                        {post.excerpt && (
                          <span className="truncate text-[0.78rem] text-slate-400 max-[480px]:hidden">
                            {post.excerpt}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                      {post.status === 'published' && (
                        <Link to={postPath(post.slug)} className={BTN_GHOST_SM}>
                          <Eye size={14} aria-hidden="true" />
                          View
                        </Link>
                      )}
                      <Link to={`/editor/${post.id}`} className={BTN_GHOST_SM}>
                        <PenSquare size={14} aria-hidden="true" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        className={`${BTN_GHOST_SM} text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700`}
                        onClick={() => {
                          setDeleteError('');
                          setDeleteTarget(post);
                        }}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this post?"
        description={
          deleteTarget
            ? `“${deleteTarget.title}” will be permanently removed. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete post"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
