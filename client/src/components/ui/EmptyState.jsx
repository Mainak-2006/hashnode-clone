export default function EmptyState({ icon: Icon, title, body, action, className = '' }) {
  return (
    <div
      className={`rounded-[18px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center ${className}`.trim()}
    >
      {Icon && (
        <span
          className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-white text-brand-600 shadow-soft"
          aria-hidden="true"
        >
          <Icon size={22} />
        </span>
      )}
      <h2 className="text-[1.08rem] font-bold text-ink-900">{title}</h2>
      {body && <p className="mx-auto mt-2 max-w-[440px] text-[0.92rem] text-slate-500">{body}</p>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2.5">{action}</div>}
    </div>
  );
}
