import { Link } from 'react-router-dom';
import { tagPath } from '../../utils/format';

export default function TagPill({ tag, size = 'md', className = '' }) {
  const slug = typeof tag === 'string' ? tag : tag?.slug;
  const name = typeof tag === 'string' ? tag : tag?.name;
  if (!slug || !name) return null;

  const sizing =
    size === 'sm'
      ? 'px-2.5 py-[3px] text-[0.72rem]'
      : 'px-3 py-1 text-[0.78rem]';

  return (
    <Link
      to={tagPath(slug)}
      className={`inline-flex items-center rounded-full border border-brand-500/20 bg-brand-50 font-semibold text-brand-600 no-underline transition-colors hover:border-brand-500/40 hover:bg-brand-50 hover:text-brand-600 hover:no-underline ${sizing} ${className}`.trim()}
    >
      #{name}
    </Link>
  );
}
