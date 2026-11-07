import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, PenSquare, X } from 'lucide-react';
import Brand from '../Brand';
import Avatar from '../ui/Avatar';
import useAuth from '../../hooks/useAuth';

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

  const linkClass = ({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`;

  return (
    <header className="nav">
      <div className="nav__inner container">
        <Brand />

        <button
          type="button"
          className="nav__toggle"
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
          className={`nav__links${menuOpen ? ' nav__links--open' : ''}`}
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

              <div className="nav__user">
                <Avatar name={user?.name} src={user?.avatarUrl} size={34} />
                <span className="nav__user-name">{user?.name}</span>
              </div>

              <button type="button" className="btn btn--ghost btn--sm nav__logout" onClick={handleLogout}>
                <LogOut size={16} aria-hidden="true" />
                Log out
              </button>
            </>
          ) : (
            <div className="nav__auth">
              <NavLink to="/login" className={linkClass}>
                Log in
              </NavLink>
              <Link to="/register" className="btn btn--primary btn--sm">
                Get started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
