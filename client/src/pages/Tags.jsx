import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Hash, Search, Tags as TagsIcon } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import Skeleton from '../components/ui/Skeleton';
import { listTags } from '../api/tags';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getErrorMessage } from '../utils/errors';
import { tagPath } from '../utils/format';

const BTN_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-violet-500))] px-5 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-white no-underline shadow-brand transition-all duration-150 hover:-translate-y-px hover:text-white hover:no-underline hover:shadow-brand-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

export default function Tags() {
  useDocumentTitle('Tags');

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const loadTags = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { tags: fetched } = await listTags();
      setTags(fetched || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load tags.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const visible = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return tags;
    return tags.filter((tag) => tag.name.toLowerCase().includes(term));
  }, [tags, filter]);

  const usedCount = useMemo(() => tags.filter((tag) => tag.count > 0).length, [tags]);

  return (
    <div className="mx-auto w-full max-w-[1000px] px-6 pt-10 pb-[76px] max-md:px-[18px] max-[560px]:pt-7">
      <header className="max-w-[680px]">
        <p className="mb-2 inline-flex items-center gap-1.5 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-brand-600">
          <TagsIcon size={14} aria-hidden="true" />
          Explore
        </p>
        <h1 className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
          Browse by tag
        </h1>
        <p className="mt-2.5 text-[0.96rem] text-slate-500">
          Find articles about the tools, languages, and ideas you care about. Counts include published
          posts only.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex h-11 w-full max-w-[340px] items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 text-slate-400 transition-[border-color,box-shadow] focus-within:border-brand-500 focus-within:text-brand-600 focus-within:shadow-ring">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filter tags…"
            aria-label="Filter tags"
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-[0.92rem] text-ink-900 outline-none placeholder:text-slate-400"
          />
        </div>

        {!loading && !error && (
          <p className="text-[0.84rem] text-slate-500">
            {tags.length} tags · {usedCount} with published posts
          </p>
        )}
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 min-[560px]:grid-cols-3 lg:grid-cols-4" aria-busy="true">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-[74px] rounded-[14px]" />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadTags} />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={Hash}
            title={filter ? 'No tags match that filter' : 'No tags yet'}
            body={
              filter
                ? 'Try a different keyword or clear the filter.'
                : 'Tags appear automatically when authors publish posts with tags.'
            }
            action={
              filter ? (
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[0.9rem] font-semibold text-slate-700 shadow-soft hover:bg-slate-50"
                  onClick={() => setFilter('')}
                >
                  Clear filter
                </button>
              ) : (
                <Link to="/feed" className={BTN_PRIMARY}>
                  Browse the feed
                </Link>
              )
            }
          />
        ) : (
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 min-[560px]:grid-cols-3 lg:grid-cols-4">
            {visible.map((tag) => (
              <li key={tag.id || tag.slug}>
                <Link
                  to={tagPath(tag.slug)}
                  className="group flex h-full items-center justify-between gap-2 rounded-[14px] border border-slate-200 bg-white p-4 no-underline shadow-soft transition duration-150 hover:-translate-y-[2px] hover:border-brand-500/40 hover:shadow-card"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <Hash size={15} aria-hidden="true" />
                    </span>
                    <span className="truncate text-[0.9rem] font-semibold text-ink-900 group-hover:text-brand-600">
                      {tag.name}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-[2px] text-[0.72rem] font-bold text-slate-500">
                    {tag.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
