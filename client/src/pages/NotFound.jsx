import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

const BTN_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-violet-500))] px-[18px] py-[11px] text-[0.94rem] font-semibold whitespace-nowrap text-white no-underline shadow-brand transition-all duration-150 hover:-translate-y-px hover:text-white hover:no-underline hover:shadow-brand-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

const BTN_GHOST =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-[18px] py-[11px] text-[0.94rem] font-semibold whitespace-nowrap text-slate-700 no-underline shadow-soft transition-all duration-150 hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:text-ink-900 hover:no-underline active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

export default function NotFound() {
  useDocumentTitle('Page not found');

  return (
    <div className="grid min-h-[calc(100vh-70px-260px)] place-items-center px-6 py-14 max-[560px]:px-[18px] max-[560px]:py-10">
      <div className="max-w-[460px] text-center">
        <p className="bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-violet-500))] bg-clip-text text-[4.6rem] font-extrabold leading-none tracking-[-0.05em] text-transparent">
          404
        </p>
        <h1 className="mt-3 text-[1.7rem] font-extrabold">Page not found</h1>
        <p className="mt-3 text-slate-500">
          The page you requested does not exist, or it may have moved.
        </p>
        <div className="mt-[26px] flex flex-wrap justify-center gap-2.5">
          <Link to="/" className={BTN_PRIMARY}>
            Back to home
          </Link>
          <Link to="/dashboard" className={BTN_GHOST}>
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
