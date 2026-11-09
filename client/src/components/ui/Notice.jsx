import { CheckCircle2 } from 'lucide-react';

export default function Notice({ message, className = '' }) {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[0.89rem] font-medium text-emerald-800 ${className}`.trim()}
      role="status"
    >
      <CheckCircle2 size={18} className="shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
