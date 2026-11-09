export default function LoadingSpinner({ label = 'Loading…', inline = false }) {
  if (inline) {
    return (
      <span
        className="inline-block size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
        role="status"
        aria-label={label}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 text-[0.9rem] text-slate-500" role="status" aria-live="polite">
      <span
        className="inline-block size-[26px] animate-spin rounded-full border-[3px] border-slate-200 border-t-brand-500 motion-reduce:animate-none"
        aria-hidden="true"
      />
      <p>{label}</p>
    </div>
  );
}
