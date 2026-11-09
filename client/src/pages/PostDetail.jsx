import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  FileQuestion,
  PenSquare,
  Trash2,
} from 'lucide-react';
import MarkdownPreview from '../components/markdown/MarkdownPreview';
import TagPill from '../components/posts/TagPill';
import Avatar from '../components/ui/Avatar';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { deletePost, getPostBySlug } from '../api/posts';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { copyToClipboard } from '../utils/clipboard';
import { getErrorMessage } from '../utils/errors';
import { formatLongDate, profilePath, readingTimeLabel, tagPath } from '../utils/format';

const BTN_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-violet-500))] px-5 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-white no-underline shadow-brand transition-all duration-150 hover:-translate-y-px hover:text-white hover:no-underline hover:shadow-brand-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

const BTN_GHOST =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-slate-700 no-underline shadow-soft transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-ink-900 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

export default function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const [copyState, setCopyState] = useState('idle');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const copyTimer = useRef(null);

  useDocumentTitle(post?.title || 'Post');

  const loadPost = useCallback(async () => {
    setLoading(true);
    setError('');
    setNotFound(false);
    try {
      const data = await getPostBySlug(slug);
      setPost(data.post || null);
      setCoverFailed(false);
    } catch (err) {
      if (err?.response?.status === 404) setNotFound(true);
      else setError(getErrorMessage(err, 'Could not load this post.'));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const handleCopyLink = async () => {
    const copied = await copyToClipboard(window.location.href);
    setCopyState(copied ? 'copied' : 'error');
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState('idle'), 2000);
  };

  const authorId = post?.author?.id || post?.author?._id;
  const isOwner = Boolean(user?.id && authorId && String(user.id) === String(authorId));

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await deletePost(post.id);
      navigate('/dashboard', { replace: true, state: { notice: `“${post.title}” was deleted.` } });
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'Could not delete this post.'));
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-70px)] place-items-center px-6 py-16">
        <LoadingSpinner label="Loading article…" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto w-full max-w-[720px] px-6 py-16 max-md:px-[18px]">
        <EmptyState
          icon={FileQuestion}
          title="Post not found"
          body="This article does not exist, was unpublished, or the link is incorrect. Drafts are never available publicly."
          action={
            <>
              <Link to="/feed" className={BTN_PRIMARY}>
                Browse the feed
              </Link>
              <Link to="/tags" className={BTN_GHOST}>
                Browse tags
              </Link>
            </>
          }
        />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto w-full max-w-[720px] px-6 py-16 max-md:px-[18px]">
        <Link to="/feed" className={`${BTN_GHOST} mb-5`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to feed
        </Link>
        <ErrorMessage message={error || 'Post not found.'} onRetry={loadPost} />
      </div>
    );
  }

  const author = post.author && typeof post.author === 'object' ? post.author : null;
  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <div className="mx-auto w-full max-w-[1160px] px-6 pt-8 pb-[80px] max-md:px-[18px]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/feed"
          className="inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-slate-500 no-underline transition-colors hover:text-ink-900 hover:no-underline"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to feed
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={BTN_GHOST} onClick={handleCopyLink}>
            {copyState === 'copied' ? (
              <Check size={16} className="text-emerald-600" aria-hidden="true" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
            {copyState === 'copied' ? 'Link copied' : copyState === 'error' ? 'Copy failed' : 'Copy link'}
          </button>
          {isOwner && (
            <>
              <Link to={`/editor/${post.id}`} className={BTN_GHOST}>
                <PenSquare size={16} aria-hidden="true" />
                Edit
              </Link>
              <button
                type="button"
                className={`${BTN_GHOST} text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700`}
                onClick={() => {
                  setDeleteError('');
                  setConfirmOpen(true);
                }}
              >
                <Trash2 size={16} aria-hidden="true" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <article className="grid grid-cols-[minmax(0,1fr)_300px] items-start gap-7 max-lg:grid-cols-1">
        <div className="min-w-0">
          <header className="border-b border-slate-200 pb-6">
            {tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <TagPill key={tag.id || tag.slug} tag={tag} size="sm" />
                ))}
              </div>
            )}

            <h1 className="text-[clamp(1.8rem,4vw,2.75rem)] font-extrabold leading-[1.12] tracking-[-0.035em] text-ink-900">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-3 max-w-[720px] text-[1.02rem] leading-[1.65] text-slate-500">
                {post.excerpt}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.82rem] text-slate-500">
              <Link
                to={profilePath(author?.id)}
                className="flex items-center gap-2 font-semibold text-slate-700 no-underline hover:text-brand-600 hover:no-underline"
              >
                <Avatar name={author?.name || 'Author'} src={author?.avatarUrl} size={30} />
                {author?.name || 'Unknown author'}
              </Link>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} aria-hidden="true" />
                {formatLongDate(post.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} aria-hidden="true" />
                {readingTimeLabel(post.readingTime)}
              </span>
            </div>
          </header>

          {post.coverImage && !coverFailed && (
            <div className="mt-6 overflow-hidden rounded-[18px] border border-slate-200 bg-slate-100">
              <img
                src={post.coverImage}
                alt=""
                className="aspect-[2/1] w-full object-cover"
                onError={() => setCoverFailed(true)}
              />
            </div>
          )}

          {deleteError && <ErrorMessage message={deleteError} className="mt-5" />}

          <div className="mx-auto mt-7 max-w-[780px]">
            <MarkdownPreview content={post.content} />
          </div>

          {tags.length > 0 && (
            <div className="mt-10 border-t border-slate-200 pt-5">
              <p className="mb-2 text-[0.76rem] font-bold uppercase tracking-[0.1em] text-slate-400">
                Filed under
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <TagPill key={`bottom-${tag.id || tag.slug}`} tag={tag} />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-[86px]">
          <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-soft">
            <p className="mb-3 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-slate-400">
              Written by
            </p>
            <Link
              to={profilePath(author?.id)}
              className="flex items-center gap-3 no-underline hover:no-underline"
            >
              <Avatar name={author?.name || 'Author'} src={author?.avatarUrl} size={46} />
              <span className="min-w-0">
                <span className="block truncate text-[0.95rem] font-bold text-ink-900">
                  {author?.name || 'Unknown author'}
                </span>
                <span className="block text-[0.78rem] text-slate-500">View profile →</span>
              </span>
            </Link>
            {author?.bio && (
              <p className="mt-3 text-[0.85rem] leading-[1.6] text-slate-500">{author.bio}</p>
            )}
          </section>

          <section className="rounded-[18px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-slate-400">
              In this post
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.length > 0 ? (
                tags.map((tag) => <TagPill key={`side-${tag.id || tag.slug}`} tag={tag} size="sm" />)
              ) : (
                <span className="text-[0.82rem] text-slate-500">No tags.</span>
              )}
            </div>
            <Link
              to={isOwner ? '/dashboard' : '/feed'}
              className={`${BTN_GHOST} mt-4 w-full`}
            >
              {isOwner ? 'Manage your posts' : 'Read more posts'}
            </Link>
          </section>
        </aside>
      </article>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this post?"
        description={`“${post.title}” will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete post"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
