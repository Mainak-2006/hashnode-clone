import { Link } from 'react-router-dom';

const SIZES = {
  sm: { root: 'text-base', mark: 'size-[30px] rounded-[9px]' },
  md: { root: 'text-[1.12rem]', mark: 'size-9 rounded-[10px]' },
  lg: { root: 'text-[1.32rem]', mark: 'size-11 rounded-[13px]' },
};

export default function Brand({ to = '/', size = 'md', showText = true, tone = 'dark' }) {
  const { root, mark } = SIZES[size] ?? SIZES.md;
  const isLight = tone === 'light';

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2.5 font-extrabold tracking-[-0.03em] no-underline hover:no-underline ${root} ${
        isLight ? 'text-white' : 'text-ink-900'
      }`}
      aria-label="Hashnode Clone home"
    >
      <span
        className={`grid shrink-0 place-items-center overflow-hidden shadow-mark ${mark}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 64 64" className="size-full" role="img" focusable="false">
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
        <span className="whitespace-nowrap">
          Hashnode<span className={isLight ? 'text-[#a5b8ff]' : 'text-brand-600'}>Clone</span>
        </span>
      )}
    </Link>
  );
}
