export default function Skeleton({ className = '' }) {
  return (
    <span
      className={`block animate-pulse rounded-md bg-slate-200/80 motion-reduce:animate-none ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
