import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Compass, Loader2, PenLine, RefreshCw, SearchX, Tags } from 'lucide-react';
import PostList from '../components/posts/PostList';
import SearchBar from '../components/posts/SearchBar';
import ErrorMessage from '../components/ui/ErrorMessage';
import { listPosts } from '../api/posts';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getErrorMessage } from '../utils/errors';

const BTN_GHOST =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-slate-700 no-underline shadow-soft transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-ink-900 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

const BTN_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-violet-500))] px-5 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-white no-underline shadow-brand transition-all duration-150 hover:-translate-y-px hover:text-white hover:no-underline hover:shadow-brand-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

const PAGE_SIZE = 9;

export default function Feed() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();
  const requestRef = useRef(0);

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState('');

  useDocumentTitle(query ? `Search: ${query}` : 'Feed');

  const loadFirstPage = useCallback(async () => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setLoading(true);
    setError('');
    setLoadMoreError('');
    setPosts([]);
    setPagination(null);

    try {
      const data = await listPosts({ q: query || undefined, page: 1, limit: PAGE_SIZE });
      if (requestRef.current !== requestId) return;
      setPosts(data.posts || []);
      setPagination(data.pagination || null);
    } catch (err) {
      if (requestRef.current !== requestId) return;
      setError(getErrorMessage(err, 'Could not load the feed.'));
    } finally {
      if (requestRef.current === requestId) setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const handleSearch = (term) => {
    setSearchParams(term ? { q: term } : {}, { replace: true });
  };

  const handleLoadMore = async () => {
    if (!pagination?.hasMore || loadingMore) return;
    setLoadingMore(true);
    setLoadMoreError('');
    try {
      const data = await listPosts({
        q: query || undefined,
        page: pagination.page + 1,
        limit: PAGE_SIZE,
      });
      setPosts((current) => [...current, ...(data.posts || [])]);
      setPagination(data.pagination || null);
    } catch (err) {
      setLoadMoreError(getErrorMessage(err, 'Could not load more posts.'));
    } finally {
      setLoadingMore(false);
    }
  };

  const total = pagination?.total ?? posts.length;

  return (
    <div className="mx-auto w-full max-w-[1160px] px-6 pt-10 pb-[76px] max-md:px-[18px] max-[560px]:pt-7">
      <section className="rounded-[22px] border border-slate-200 bg-white p-7 shadow-soft max-[560px]:p-5 [background-image:radial-gradient(560px_220px_at_0%_0%,rgba(41,98,255,0.1),transparent_62%),radial-gradient(520px_260px_at_100%_0%,rgba(124,58,237,0.09),transparent_62%)]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[640px]">
            <p className="mb-2 inline-flex items-center gap-1.5 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-brand-600">
              <Compass size={14} aria-hidden="true" />
              Public feed
            </p>
            <h1 className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
              {query ? 'Search the community' : 'Stories from the community'}
            </h1>
            <p className="mt-2.5 text-[0.96rem] text-slate-500">
              {query
                ? `Published articles matching “${query}”.`
                : 'Fresh technical writing, code-heavy tutorials, and lessons from building things.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/tags" className={BTN_GHOST}>
              <Tags size={16} aria-hidden="true" />
              Browse tags
            </Link>
            {isAuthenticated ? (
              <Link to="/editor/new" className={BTN_PRIMARY}>
                <PenLine size={16} aria-hidden="true" />
                Write a post
              </Link>
            ) : (
              <Link to="/register" className={BTN_PRIMARY}>
                Start writing
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        <div className="mt-6 max-w-[720px]">
          <SearchBar value={query} onSubmit={handleSearch} onClear={() => handleSearch('')} />
        </div>
      </section>

      <div className="mt-7 mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[1.08rem] font-bold">
          {query ? (
            <>
              Results for <span className="text-brand-600">“{query}”</span>
            </>
          ) : (
            'Latest posts'
          )}
        </h2>
        {!loading && !error && (
          <p className="text-[0.84rem] text-slate-500">
            {total} {total === 1 ? 'post' : 'posts'}
            {posts.length > 0 && posts.length < total ? ` · showing ${posts.length}` : ''}
          </p>
        )}
      </div>

      <PostList
        posts={posts}
        loading={loading}
        error={error}
        onRetry={loadFirstPage}
        skeletonCount={6}
        emptyIcon={query ? SearchX : PenLine}
        emptyTitle={query ? 'No posts match that search' : 'The feed is empty'}
        emptyBody={
          query
            ? 'Try a shorter or different title keyword, or clear the search to see everything.'
            : 'When authors publish their first article, it will show up here.'
        }
        emptyAction={
          query ? (
            <button type="button" className={BTN_GHOST} onClick={() => handleSearch('')}>
              <RefreshCw size={16} aria-hidden="true" />
              Clear search
            </button>
          ) : (
            <Link to={isAuthenticated ? '/editor/new' : '/register'} className={BTN_PRIMARY}>
              <PenLine size={16} aria-hidden="true" />
              {isAuthenticated ? 'Write the first post' : 'Create an account'}
            </Link>
          )
        }
      />

      {loadMoreError && <ErrorMessage message={loadMoreError} className="mt-5" onRetry={handleLoadMore} />}

      {!loading && !error && pagination?.hasMore && (
        <div className="mt-8 flex justify-center">
          <button type="button" className={BTN_GHOST} onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <ArrowRight size={16} className="rotate-90" aria-hidden="true" />
            )}
            {loadingMore ? 'Loading more…' : 'Load more posts'}
          </button>
        </div>
      )}
    </div>
  );
}
