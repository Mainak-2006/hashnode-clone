import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Hash, Loader2, Plus, Tags as TagsIcon } from 'lucide-react';
import PostList from '../components/posts/PostList';
import TagPill from '../components/posts/TagPill';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import { getTagPosts, listTags } from '../api/tags';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getErrorMessage } from '../utils/errors';

const BTN_GHOST =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-slate-700 no-underline shadow-soft transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-ink-900 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

const BTN_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-violet-500))] px-5 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-white no-underline shadow-brand transition-all duration-150 hover:-translate-y-px hover:text-white hover:no-underline hover:shadow-brand-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

const PAGE_SIZE = 9;

export default function TagPage() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const requestRef = useRef(0);

  const [tag, setTag] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState('');

  useDocumentTitle(tag ? `#${tag.name}` : 'Tag');

  useEffect(() => {
    setLoading(true);
    setError('');
    setNotFound(false);

    Promise.allSettled([listTags(), getTagPosts(slug, { page: 1, limit: PAGE_SIZE })]).then(
      ([tagsResult, postsResult]) => {
        if (tagsResult.status === 'fulfilled') {
          setAllTags(tagsResult.value.tags || []);
        }

        if (postsResult.status === 'rejected') {
          const err = postsResult.reason;
          if (err?.response?.status === 404) {
            setNotFound(true);
          } else {
            setError(getErrorMessage(err, 'Could not load this tag.'));
          }
          setLoading(false);
          return;
        }

        setTag(postsResult.value.tag || null);
        setPosts(postsResult.value.posts || []);
        setPagination(postsResult.value.pagination || null);
        setLoading(false);
      }
    );
  }, [slug]);

  const loadFirstPage = useCallback(() => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setLoading(true);
    setError('');
    setNotFound(false);

    getTagPosts(slug, { page: 1, limit: PAGE_SIZE })
      .then((data) => {
        if (requestRef.current !== requestId) return;
        setTag(data.tag || null);
        setPosts(data.posts || []);
        setPagination(data.pagination || null);
        setLoading(false);
      })
      .catch((err) => {
        if (requestRef.current !== requestId) return;
        if (err?.response?.status === 404) setNotFound(true);
        else setError(getErrorMessage(err, 'Could not load this tag.'));
        setLoading(false);
      });
  }, [slug]);

  const handleLoadMore = async () => {
    if (!pagination?.hasMore || loadingMore) return;
    setLoadingMore(true);
    setLoadMoreError('');
    try {
      const data = await getTagPosts(slug, { page: pagination.page + 1, limit: PAGE_SIZE });
      setPosts((current) => [...current, ...(data.posts || [])]);
      setPagination(data.pagination || null);
    } catch (err) {
      setLoadMoreError(getErrorMessage(err, 'Could not load more posts.'));
    } finally {
      setLoadingMore(false);
    }
  };

  const related = allTags.filter((item) => item.slug !== slug && item.count > 0).slice(0, 10);

  if (notFound) {
    return (
      <div className="mx-auto w-full max-w-[720px] px-6 py-16 max-md:px-[18px]">
        <EmptyState
          icon={Hash}
          title="Tag not found"
          body={`No tag exists for “#${slug}”. It may have been removed, or no posts use it yet.`}
          action={
            <>
              <Link to="/tags" className={BTN_PRIMARY}>
                <TagsIcon size={16} aria-hidden="true" />
                Browse all tags
              </Link>
              <Link to="/feed" className={BTN_GHOST}>
                Back to feed
              </Link>
            </>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1160px] px-6 pt-10 pb-[76px] max-md:px-[18px] max-[560px]:pt-7">
      <Link
        to="/tags"
        className="mb-5 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-slate-500 no-underline transition-colors hover:text-ink-900 hover:no-underline"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        All tags
      </Link>

      <header className="rounded-[22px] border border-slate-200 bg-white p-7 shadow-soft max-[560px]:p-5 [background-image:radial-gradient(560px_220px_at_0%_0%,rgba(41,98,255,0.12),transparent_62%),radial-gradient(520px_260px_at_100%_0%,rgba(124,58,237,0.1),transparent_62%)]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-brand-500/20 bg-white/80 px-3 py-1 text-[0.78rem] font-bold text-brand-600">
              <Hash size={13} aria-hidden="true" />
              {tag?.name || slug}
            </p>
            <h1 className="text-[clamp(1.7rem,3.3vw,2.4rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
              Posts tagged <span className="text-brand-600">#{tag?.name || slug}</span>
            </h1>
            <p className="mt-2 text-[0.94rem] text-slate-500">
              {loading
                ? 'Loading published articles…'
                : `${pagination?.total ?? posts.length} published ${
                    (pagination?.total ?? posts.length) === 1 ? 'post' : 'posts'
                  } in this topic.`}
            </p>
          </div>

          {isAuthenticated && (
            <Link to="/editor/new" className={BTN_PRIMARY}>
              <Plus size={16} aria-hidden="true" />
              Write about this
            </Link>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t border-slate-200/70 pt-4">
            <span className="mr-1 inline-flex items-center gap-1 text-[0.76rem] font-semibold text-slate-400">
              <TagsIcon size={13} aria-hidden="true" />
              Related:
            </span>
            {related.map((item) => (
              <TagPill key={item.id || item.slug} tag={item} size="sm" />
            ))}
          </div>
        )}
      </header>

      <div className="mt-7">
        <PostList
          posts={posts}
          loading={loading}
          error={error}
          onRetry={loadFirstPage}
          skeletonCount={6}
          emptyIcon={Hash}
          emptyTitle="No published posts in this tag yet"
          emptyBody="Drafts never appear here. Once an author publishes a post with this tag, it will show up."
          emptyAction={
            <Link to="/feed" className={BTN_GHOST}>
              Back to feed
            </Link>
          }
        />

        {loadMoreError && (
          <ErrorMessage message={loadMoreError} className="mt-5" onRetry={handleLoadMore} />
        )}

        {!loading && !error && pagination?.hasMore && (
          <div className="mt-8 flex justify-center">
            <button type="button" className={BTN_GHOST} onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Plus size={16} aria-hidden="true" />
              )}
              {loadingMore ? 'Loading more…' : 'Load more posts'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
