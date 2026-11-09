export default function Avatar({ name = '', src = '', size = 40, className = '' }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const style = { width: size, height: size, fontSize: Math.round(size * 0.38) };

  if (src) {
    return (
      <img
        className={`shrink-0 rounded-full bg-slate-100 object-cover ${className}`}
        style={style}
        src={src}
        alt={name ? `${name}'s avatar` : 'User avatar'}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-full font-bold tracking-[0.02em] text-white [background-image:linear-gradient(135deg,var(--color-brand-500),var(--color-violet-500))] ${className}`}
      style={style}
      aria-hidden="true"
    >
      {initials || '?'}
    </span>
  );
}
