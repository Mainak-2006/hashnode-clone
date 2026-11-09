import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock3 } from 'lucide-react';
import Avatar from '../ui/Avatar';
import TagPill from './TagPill';
import { formatDate, postPath, profilePath, readingTimeLabel } from '../../utils/format';

function Cover({ post }) {
  const [failed, setFailed] = useState(false);
  const hasCover = Boolean(post.coverImage) && !failed;

  return (
    <Link
      to={postPath(post.slug)}
      className="relative block aspect-[16/9] overflow-hidden border-b border-slate-200 bg-slate-100 no-underline"
      tabIndex={-1}
      aria-hidden="true"
    >
      {hasCover ? (
        <img
          src={post.coverImage}
          alt=""
          className="size-full object-cover transition-transform duration-300 hover:scale-[1.025]"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="grid size-full place-items-center bg-[radial-gradient(420px_180px_at_20%_0%,rgba(41,98,255,0.32),transparent_65%),radial-gradient(360px_200px_at_100%_100%,rgba(124,58,237,0.3),transparent_62%)]">
          <BookOpen size={30} className="text-white/85" />
        </span>
      )}
    </Link>
  );
}

export default function PostCard({ post }) {
  if (!post) return null;

  const author = post.author && typeof post.author === 'object' ? post.author : null;
  const tags = Array.isArray(post.tags) ? post.tags.slice(0, 3) : [];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-soft transition duration-200 hover:-translate-y-[3px] hover:border-[rgba(41,98,255,0.35)] hover:shadow-card">
      <Cover post={post} />

      <div className="flex flex-1 flex-col p-5">
        {tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <TagPill key={tag.id || tag.slug || tag} tag={tag} size="sm" />
            ))}
          </div>
        )}

        <h2 className="m-0 text-[1.08rem] font-bold leading-[1.35] tracking-[-0.01em]">
          <Link
            to={postPath(post.slug)}
            className="text-ink-900 no-underline transition-colors hover:text-brand-600 hover:no-underline"
          >
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-[0.88rem] leading-[1.6] text-slate-500">{post.excerpt}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 [margin-top:1rem]">
          <Link
            to={profilePath(author?.id)}
            className="flex min-w-0 items-center gap-2 no-underline hover:no-underline"
          >
            <Avatar name={author?.name || 'Author'} src={author?.avatarUrl} size={30} />
            <span className="truncate text-[0.8rem] font-semibold text-slate-700 hover:text-ink-900">
              {author?.name || 'Unknown author'}
            </span>
          </Link>

          <span className="flex shrink-0 items-center gap-2.5 text-[0.74rem] text-slate-400">
            <span>{formatDate(post.createdAt)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 size={13} aria-hidden="true" />
              {readingTimeLabel(post.readingTime)}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
