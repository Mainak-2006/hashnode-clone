import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

const BTN_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-violet-500))] px-5 py-2.5 text-[0.9rem] font-semibold whitespace-nowrap text-white shadow-brand transition-all duration-150 hover:-translate-y-px hover:shadow-brand-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

export default function SearchBar({ value = '', onSubmit, onClear, placeholder = 'Search posts by title…' }) {
  const [term, setTerm] = useState(value);

  useEffect(() => {
    setTerm(value);
  }, [value]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(term.trim());
  };

  const handleClear = () => {
    setTerm('');
    onClear?.();
  };

  return (
    <form className="flex w-full flex-col gap-2.5 min-[560px]:flex-row" onSubmit={handleSubmit} role="search">
      <div className="flex h-12 flex-1 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 text-slate-400 transition-[border-color,box-shadow] focus-within:border-brand-500 focus-within:text-brand-600 focus-within:shadow-ring">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder={placeholder}
          aria-label="Search posts by title"
          className="h-full min-w-0 flex-1 border-0 bg-transparent text-[0.95rem] text-ink-900 outline-none placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
        />
        {term && (
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <button type="submit" className={BTN_PRIMARY}>
        <Search size={16} aria-hidden="true" />
        Search
      </button>
    </form>
  );
}
