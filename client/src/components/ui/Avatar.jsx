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
        className={`avatar ${className}`}
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
    <span className={`avatar avatar--initials ${className}`} style={style} aria-hidden="true">
      {initials || '?'}
    </span>
  );
}
