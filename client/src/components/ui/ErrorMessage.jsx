const BTN_GHOST_SM =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[0.87rem] font-semibold whitespace-nowrap text-slate-700 no-underline shadow-soft transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-ink-900 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

export default function ErrorMessage({ message, onRetry, className = '' }) {
  if (!message) return null;

  return (
    <div
      className={`flex gap-[11px] rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[0.89rem] text-red-700 ${className}`}
      role="alert"
    >
      <span
        className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-red-700 text-[0.72rem] font-extrabold text-white"
        aria-hidden="true"
      >
        !
      </span>
      <div className="flex flex-col items-start gap-2">
        <p>{message}</p>
        {onRetry && (
          <button type="button" className={BTN_GHOST_SM} onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
