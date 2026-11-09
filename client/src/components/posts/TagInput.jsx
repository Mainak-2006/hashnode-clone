import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const normalize = (value) => String(value || '').trim().replace(/^#+/, '').trim();

export default function TagInput({
  id = 'post-tags',
  value = [],
  onChange,
  suggestions = [],
  max = 5,
  error,
  hint,
  disabled = false,
}) {
  const [draft, setDraft] = useState('');

  const addTag = (raw) => {
    const name = normalize(raw);
    if (!name || value.length >= max) return;
    const exists = value.some((tag) => tag.toLowerCase() === name.toLowerCase());
    if (exists) {
      setDraft('');
      return;
    }
    onChange?.([...value, name]);
    setDraft('');
  };

  const removeTag = (name) => {
    onChange?.(value.filter((tag) => tag !== name));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag(draft);
      return;
    }
    if (event.key === 'Backspace' && !draft && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const available = suggestions
    .map((tag) => (typeof tag === 'string' ? tag : tag?.name))
    .filter(Boolean)
    .filter((name) => !value.some((tag) => tag.toLowerCase() === name.toLowerCase()))
    .filter((name) => name.toLowerCase().includes(draft.trim().toLowerCase()))
    .slice(0, 8);

  return (
    <div>
      <div
        className={`flex min-h-12 flex-wrap items-center gap-2 rounded-xl border bg-white px-3 py-2 transition-[border-color,box-shadow] ${
          error
            ? 'border-red-200 bg-red-50 focus-within:border-red-700 focus-within:shadow-ring-danger'
            : 'border-slate-200 focus-within:border-brand-500 focus-within:shadow-ring'
        }`}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[0.8rem] font-semibold text-brand-600"
          >
            #{tag}
            <button
              type="button"
              className="grid size-4 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-brand-600 transition-colors hover:bg-brand-500/15"
              onClick={() => removeTag(tag)}
              aria-label={`Remove tag ${tag}`}
              disabled={disabled}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <label className="sr-only" htmlFor={id}>
          Add tags
        </label>
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={value.length >= max ? 'Tag limit reached' : 'Add a tag and press Enter'}
          className="h-7 min-w-[150px] flex-1 border-0 bg-transparent text-[0.9rem] text-ink-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          disabled={disabled || value.length >= max}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />
      </div>

      {available.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[0.76rem] font-medium text-slate-400">Suggestions:</span>
          {available.map((name) => (
            <button
              key={name}
              type="button"
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-[3px] text-[0.75rem] font-medium text-slate-600 transition-colors hover:border-brand-500/40 hover:bg-brand-50 hover:text-brand-600"
              onClick={() => addTag(name)}
              disabled={disabled || value.length >= max}
            >
              <Plus size={11} aria-hidden="true" />
              {name}
            </button>
          ))}
        </div>
      )}

      {error ? (
        <p className="mt-1.5 text-[0.8rem] text-red-700" id={`${id}-error`}>
          {error}
        </p>
      ) : (
        hint && (
          <p className="mt-1.5 text-[0.8rem] text-slate-500" id={`${id}-hint`}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}
