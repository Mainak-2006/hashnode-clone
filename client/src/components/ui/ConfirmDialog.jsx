import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const BTN_CANCEL =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[0.9rem] font-semibold text-slate-700 shadow-soft transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

const BTN_DANGER =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-red-600 px-4 py-2.5 text-[0.9rem] font-semibold text-white shadow-soft transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-60';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  busy = false,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) onCancel?.();
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    confirmRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 grid place-items-center bg-ink-900/55 px-4 py-6 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel?.();
      }}
    >
      <div
        className="w-full max-w-[430px] rounded-[18px] border border-slate-200 bg-white p-6 shadow-float"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle size={21} aria-hidden="true" />
          </span>
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            onClick={() => !busy && onCancel?.()}
            aria-label="Close dialog"
            disabled={busy}
          >
            <X size={18} />
          </button>
        </div>

        <h2 id="confirm-dialog-title" className="mt-4 text-[1.1rem] font-bold text-ink-900">
          {title}
        </h2>
        {description && <p className="mt-2 text-[0.92rem] leading-[1.6] text-slate-500">{description}</p>}

        <div className="mt-6 flex flex-wrap justify-end gap-2.5">
          <button type="button" className={BTN_CANCEL} onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className={BTN_DANGER}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
