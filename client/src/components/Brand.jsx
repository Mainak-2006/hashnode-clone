import { Link } from 'react-router-dom';

export default function Brand({ to = '/', size = 'md', showText = true }) {
  return (
    <Link to={to} className={`brand brand--${size}`} aria-label="Hashnode Clone home">
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img" focusable="false">
          <rect width="64" height="64" rx="16" fill="url(#brand-gradient)" />
          <path d="M35.5 12 18 35.5h11L27 52l18.5-25h-11.5L35.5 12Z" fill="#fff" />
          <defs>
            <linearGradient id="brand-gradient" x1="8" y1="6" x2="58" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2962ff" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      {showText && (
        <span className="brand__text">
          Hashnode<span className="brand__accent">Clone</span>
        </span>
      )}
    </Link>
  );
}
