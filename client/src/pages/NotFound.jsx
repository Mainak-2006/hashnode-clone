import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');

  return (
    <div className="page page--centered">
      <div className="empty-state">
        <p className="empty-state__code">404</p>
        <h1>Page not found</h1>
        <p>The page you requested does not exist, or it may have moved.</p>
        <div className="empty-state__actions">
          <Link to="/" className="btn btn--primary">
            Back to home
          </Link>
          <Link to="/dashboard" className="btn btn--ghost">
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
