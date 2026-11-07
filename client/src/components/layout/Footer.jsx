import { Link } from 'react-router-dom';
import Brand from '../Brand';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Brand size="sm" />
          <p>A developer-first blogging platform built with the MERN stack.</p>
        </div>

        <div className="footer__links">
          <Link to="/">Home</Link>
          <Link to="/login">Log in</Link>
          <Link to="/register">Create account</Link>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Hashnode Clone. Built for learning.</span>
        <span>Phase 1 — Authentication</span>
      </div>
    </footer>
  );
}
