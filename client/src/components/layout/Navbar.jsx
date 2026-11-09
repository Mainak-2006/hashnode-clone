import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import Brand from '../Brand';
import Avatar from '../ui/Avatar';
import useAuth from '../../hooks/useAuth';

const BTN_GHOST =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[0.87rem] font-semibold whitespace-nowrap text-slate-700 no-underline shadow-soft transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-ink-900 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-65';

const BTN_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-violet-500))] px-3.5 py-2 text-[0.87rem] font-semibold whitespace-nowrap text-white no-underline shadow-brand transition-all duration-150 hover:text-white hover:no-underline hover:shadow-brand-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-65';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/', { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-[0.92rem] no-underline transition-colors hover:no-underline max-[900px]:rounded-lg max-[900px]:px-3.5 max-[900px]:py-[11px] ${
      isActive
        ? 'bg-slate-100 font-semibold text-ink-900'
        : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-ink-900'
    }`;

  return (
    <header className="sticky top-0 z-40 h-[70px] border-b border-slate-200 bg-white/86 backdrop-blur-[14px] backdrop-saturate-[180%]">
      <div className="mx-auto flex h-full w-full max-w-[1140px] items-center justify-between gap-4 px-6 max-md:px-[18px]">
        <Brand />

        <button
          type="button"
          className="hidden size-10 cursor-pointer items-center justify-center rounded-[10px] border border-slate-200 bg-white text-ink-700 max-[900px]:inline-flex"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav
          id="primary-navigation"
          ref={menuRef}
          className={`flex items-center gap-1.5 max-[900px]:absolute max-[900px]:top-[70px] max-[900px]:right-0 max-[900px]:left-0 max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-1 max-[900px]:border-b max-[900px]:border-slate-200 max-[900px]:bg-white max-[900px]:px-5 max-[900px]:pt-3.5 max-[900px]:pb-5 max-[900px]:shadow-card ${
            menuOpen ? '' : 'max-[900px]:hidden'
          }`}
          aria-label="Primary"
        >
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>

              <div className="ml-2.5 flex items-center gap-[9px] rounded-full border border-slate-200 bg-white py-1 pr-3 pl-1 max-[900px]:mt-1.5 max-[900px]:ml-0 max-[900px]:justify-start max-[900px]:rounded-xl max-[900px]:px-3 max-[900px]:py-2">
                <Avatar name={user?.name} src={user?.avatarUrl} size={34} />
                <span className="max-w-[140px] truncate text-[0.88rem] font-semibold text-slate-700">
                  {user?.name}
                </span>
              </div>

              <button
                type="button"
                className={`${BTN_GHOST} ml-0.5 max-[900px]:w-full`}
                onClick={handleLogout}
              >
                <LogOut size={16} aria-hidden="true" />
                Log out
              </button>
            </>
          ) : (
            <div className="ml-2 flex items-center gap-2 max-[900px]:mt-1.5 max-[900px]:ml-0 max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-2">
              <NavLink to="/login" className={linkClass}>
                Log in
              </NavLink>
              <Link to="/register" className={`${BTN_PRIMARY} max-[900px]:w-full`}>
                Get started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
