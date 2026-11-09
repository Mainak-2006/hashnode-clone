import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, FileText, Loader2, PenLine, Settings, UserX } from 'lucide-react';
import PostList from '../components/posts/PostList';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import Skeleton from '../components/ui/Skeleton';
import { getUserProfile } from '../api/users';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getErrorMessage } from '../utils/errors';
import { formatLongDate } from '../utils/format';

const BTN_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-violet-500))] px-4 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-white no-underline shadow-brand transition-all duration-150 hover:-translate-y-px hover:text-white hover:no-underline hover:shadow-brand-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

const BTN_GHOST =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-slate-700 no-underline shadow-soft transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-ink-900 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

const PAGE_SIZE = 6;

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState('');

  useDocumentTitle(profile?.user?.name || 'Profile');

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    setNotFound(false);
    try {
      const data = await getUserProfile(id, { page: 1, limit: PAGE_SIZE });
      setProfile(data.user);
      setPosts(data.posts || []);
      setPagination(data.pagination || null);
    } catch (err) {
      if (err?.response?.status === 404) setNotFound(true);
      else setError(getErrorMessage(err, 'Could not load this profile.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleLoadMore = async () => {
    if (!pagination?.hasMore || loadingMore) return;
    setLoadingMore(true);
    setLoadMoreError('');
    try {
      const data = await getUserProfile(id, { page: pagination.page + 1, limit: PAGE_SIZE });
      setPosts((current) => [...current, ...(data.posts || [])]);
      setPagination(data.pagination || null);
    } catch (err) {
      setLoadMoreError(getErrorMessage(err, 'Could not load more posts.'));
    } finally {
      setLoadingMore(false);
    }
  };

  const isOwnProfile = Boolean(user?.id && profile?.id && String(user.id) === String(profile.id));

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1100px] px-6 pt-10 pb-[76px] max-md:px-[18px]">
        <div className="flex items-center gap-5">
          <Skeleton className="size-[84px] rounded-full" />
          <div className="flex flex-1 flex-col gap-2.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 min-[620px]:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[320px] rounded-[18px]" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto w-full max-w-[720px] px-6 py-16 max-md:px-[18px]">
        <EmptyState
          icon={UserX}
          title="Profile not found"
          body="This author does not exist, or the link is incorrect."
          action={
            <Link to="/feed" className={BTN_PRIMARY}>
              Browse the feed
            </Link>
          }
        />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto w-full max-w-[720px] px-6 py-16 max-md:px-[18px]">
        <Link to="/feed" className={`${BTN_GHOST} mb-5`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to feed
        </Link>
        <ErrorMessage message={error || 'Profile not found.'} onRetry={loadProfile} />
      </div>
    );
  }

  const total = pagination?.total ?? posts.length;

  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 pt-10 pb-[76px] max-md:px-[18px] max-[560px]:pt-7">
      <header className="rounded-[22px] border border-slate-200 bg-white p-7 shadow-soft max-[560px]:p-5 [background-image:radial-gradient(560px_240px_at_0%_0%,rgba(41,98,255,0.12),transparent_62%),radial-gradient(520px_260px_at_100%_0%,rgba(124,58,237,0.1),transparent_62%)]">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-center gap-5 max-[560px]:items-start">
            <Avatar name={profile.name} src={profile.avatarUrl} size={84} />
            <div>
              <p className="mb-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-brand-600">
                Author profile
              </p>
              <h1 className="text-[clamp(1.5rem,3.4vw,2.2rem)] font-extrabold tracking-[-0.02em]">
                {profile.name}
              </h1>
              <p className="mt-2 max-w-[560px] text-[0.92rem] leading-[1.6] text-slate-500">
                {profile.bio || 'This author has not added a bio yet.'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.8rem] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} aria-hidden="true" />
                  Joined {formatLongDate(profile.createdAt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileText size={14} aria-hidden="true" />
                  {total} published {total === 1 ? 'post' : 'posts'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {isOwnProfile ? (
              <>
                <Link to="/editor/new" className={BTN_PRIMARY}>
                  <PenLine size={16} aria-hidden="true" />
                  New post
                </Link>
                <Link to="/settings" className={BTN_GHOST}>
                  <Settings size={16} aria-hidden="true" />
                  Edit profile
                </Link>
              </>
            ) : (
              <Link to="/feed" className={BTN_GHOST}>
                Back to feed
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mt-7 mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[1.08rem] font-bold">
          {isOwnProfile ? 'Your published posts' : 'Published posts'}
        </h2>
        <p className="text-[0.84rem] text-slate-500">Drafts are always private.</p>
      </div>

      <PostList
        posts={posts}
        loading={false}
        error=""
        emptyIcon={FileText}
        emptyTitle={isOwnProfile ? 'No published posts yet' : 'No published posts yet'}
        emptyBody={
          isOwnProfile
            ? 'Publish a draft from your dashboard and it will appear on your public profile.'
            : 'This author has not published any articles yet.'
        }
        emptyAction={
          isOwnProfile ? (
            <Link to="/editor/new" className={BTN_PRIMARY}>
              <PenLine size={16} aria-hidden="true" />
              Write a post
            </Link>
          ) : (
            <Link to="/feed" className={BTN_GHOST}>
              Browse the feed
            </Link>
          )
        }
      />

      {loadMoreError && <ErrorMessage message={loadMoreError} className="mt-5" onRetry={handleLoadMore} />}

      {pagination?.hasMore && (
        <div className="mt-8 flex justify-center">
          <button type="button" className={BTN_GHOST} onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <FileText size={16} aria-hidden="true" />
            )}
            {loadingMore ? 'Loading more…' : 'Load more posts'}
          </button>
        </div>
      )}
    </div>
  );
}
