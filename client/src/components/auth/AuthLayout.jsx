import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Brand from '../Brand';

const POINTS = [
  'Write in Markdown with live preview',
  'Organize posts with developer tags',
  'Publish a public feed of your articles',
  'Secure JWT authentication out of the box',
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-[calc(100vh-70px)] grid-cols-[1.02fr_1fr] max-[900px]:grid-cols-1">
      <section
        className="relative flex flex-col justify-between overflow-hidden bg-[#0b1220] px-[52px] py-[46px] text-white max-lg:px-9 max-lg:py-[38px] max-[900px]:px-6 max-[900px]:py-8 [background-image:radial-gradient(620px_380px_at_10%_0%,rgba(41,98,255,0.55),transparent_60%),radial-gradient(560px_420px_at_92%_88%,rgba(124,58,237,0.5),transparent_62%)]"
        aria-hidden="false"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-100 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_30%_20%,#000_10%,transparent_75%)]"
          aria-hidden="true"
        />

        <div className="relative z-1">
          <Brand size="lg" tone="light" />
        </div>

        <div className="relative z-1 my-10 max-w-[460px] max-[900px]:mt-6 max-[900px]:mb-0">
          <h2 className="text-[clamp(1.7rem,2.6vw,2.3rem)] font-extrabold text-white">
            Where developers share what they build.
          </h2>
          <p className="mt-4 text-[0.98rem] text-slate-200/80">
            A clean, fast place to write technical articles, publish code-heavy posts, and grow your
            developer profile.
          </p>
          <ul className="mt-[30px] flex flex-col gap-[13px] max-[900px]:hidden">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-[11px] text-[0.92rem] text-slate-100/90">
                <CheckCircle2 size={18} className="shrink-0 text-[#7ce0b0]" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-1 text-[0.8rem] tracking-[0.04em] text-slate-400/85 max-[900px]:hidden">
          MERN stack · Markdown · Syntax highlighting
        </p>
      </section>

      <section className="flex flex-col items-center justify-center bg-white px-6 py-14 max-[560px]:px-[18px] max-[560px]:py-10">
        <div className="w-full max-w-[430px]">
          <header>
            <h1 className="text-[1.85rem] font-extrabold">{title}</h1>
            {subtitle && <p className="mt-2.5 text-[0.96rem] text-slate-500">{subtitle}</p>}
          </header>

          {children}

          {footer && (
            <div className="mt-[26px] border-t border-slate-200 pt-5 text-center text-[0.92rem] text-slate-500 [&_a]:font-semibold [&_a]:text-brand-600">
              {footer}
            </div>
          )}
        </div>

        <p className="mt-[30px] text-[0.86rem] [&_a]:text-slate-500 [&_a]:hover:text-slate-600">
          <Link to="/">← Back to home</Link>
        </p>
      </section>
    </div>
  );
}
