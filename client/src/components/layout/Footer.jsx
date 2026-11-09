import { Link } from 'react-router-dom';
import Brand from '../Brand';
import useAuth from '../../hooks/useAuth';

export default function Footer() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 bg-slate-50 pt-11 pb-7">
      <div className="mx-auto flex w-full max-w-[1140px] flex-wrap justify-between gap-8 px-6 max-md:flex-col max-md:gap-6 max-md:px-[18px]">
        <div className="max-w-[340px]">
          <Brand size="sm" />
          <p className="mt-3 text-[0.9rem] text-slate-500">
            A developer-first blogging platform built with the MERN stack.
          </p>
        </div>

        <div className="flex flex-wrap items-start gap-[22px]">
          <Link to="/" className="text-[0.92rem] text-slate-600 hover:text-ink-900 hover:underline">
            Home
          </Link>
          <Link to="/login" className="text-[0.92rem] text-slate-600 hover:text-ink-900 hover:underline">
            Log in
          </Link>
          <Link to="/register" className="text-[0.92rem] text-slate-600 hover:text-ink-900 hover:underline">
            Create account
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-[34px] flex w-full max-w-[1140px] flex-wrap justify-between gap-4 border-t border-slate-200 px-6 pt-5 text-[0.82rem] text-slate-500 max-md:px-[18px]">
        <span>© {new Date().getFullYear()} Hashnode Clone. Built for learning.</span>
        <span>Phase 1 — Authentication</span>
      </div>
    </footer>
  );
}
