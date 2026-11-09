import { Link } from 'react-router-dom';
import Brand from '../Brand';

const LINK = 'text-[0.92rem] text-slate-600 no-underline hover:text-ink-900 hover:underline';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 pt-11 pb-7">
      <div className="mx-auto flex w-full max-w-[1140px] flex-wrap justify-between gap-8 px-6 max-md:flex-col max-md:gap-6 max-md:px-[18px]">
        <div className="max-w-[340px]">
          <Brand size="sm" />
          <p className="mt-3 text-[0.9rem] text-slate-500">
            A developer-first blogging platform built with the MERN stack. Write in Markdown, publish
            code-heavy posts, and grow your profile.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-2.5">
          <div className="flex flex-col gap-2.5">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-slate-400">
              Explore
            </p>
            <Link to="/" className={LINK}>
              Home
            </Link>
            <Link to="/feed" className={LINK}>
              Feed
            </Link>
            <Link to="/tags" className={LINK}>
              Tags
            </Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-slate-400">
              Account
            </p>
            <Link to="/login" className={LINK}>
              Log in
            </Link>
            <Link to="/register" className={LINK}>
              Create account
            </Link>
            <Link to="/dashboard" className={LINK}>
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-[34px] flex w-full max-w-[1140px] flex-wrap justify-between gap-4 border-t border-slate-200 px-6 pt-5 text-[0.82rem] text-slate-500 max-md:px-[18px]">
        <span>© {new Date().getFullYear()} Hashnode Clone. Built for learning.</span>
        <span>MERN · Markdown · v1.0.0</span>
      </div>
    </footer>
  );
}
