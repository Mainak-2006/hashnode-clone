import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, LogOut, Mail, PenSquare, ShieldCheck, UserRound } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function Dashboard() {
  useDocumentTitle('Dashboard');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="page container dashboard">
      <header className="dashboard__header">
        <div className="dashboard__identity">
          <Avatar name={user?.name} src={user?.avatarUrl} size={64} />
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Welcome back, {user?.name?.split(' ')[0] || 'developer'} 👋</h1>
            <p className="dashboard__subtitle">
              Your account is set up. Writing tools arrive in Phase 2.
            </p>
          </div>
        </div>

        <button type="button" className="btn btn--ghost" onClick={handleLogout}>
          <LogOut size={17} aria-hidden="true" />
          Log out
        </button>
      </header>

      <div className="dashboard__grid">
        <section className="panel" aria-labelledby="profile-heading">
          <div className="panel__header">
            <h2 id="profile-heading">Account details</h2>
            <span className="badge badge--success">
              <ShieldCheck size={14} aria-hidden="true" />
              Authenticated
            </span>
          </div>

          <dl className="detail-list">
            <div>
              <dt>
                <UserRound size={16} aria-hidden="true" />
                Name
              </dt>
              <dd>{user?.name || '—'}</dd>
            </div>
            <div>
              <dt>
                <Mail size={16} aria-hidden="true" />
                Email
              </dt>
              <dd>{user?.email || '—'}</dd>
            </div>
            <div>
              <dt>
                <CalendarDays size={16} aria-hidden="true" />
                Member since
              </dt>
              <dd>{formatDate(user?.createdAt)}</dd>
            </div>
            <div>
              <dt>Bio</dt>
              <dd>{user?.bio || <span className="muted">No bio yet — editing lands in Phase 3.</span>}</dd>
            </div>
          </dl>
        </section>

        <section className="panel" aria-labelledby="next-heading">
          <div className="panel__header">
            <h2 id="next-heading">What’s next</h2>
          </div>

          <ul className="task-list">
            <li>
              <PenSquare size={17} aria-hidden="true" />
              <div>
                <strong>Write your first post</strong>
                <p>Markdown editor and drafts arrive in Phase 2.</p>
              </div>
            </li>
            <li>
              <PenSquare size={17} aria-hidden="true" />
              <div>
                <strong>Publish to the feed</strong>
                <p>Public feed, tags, and search arrive in Phase 3.</p>
              </div>
            </li>
            <li>
              <ShieldCheck size={17} aria-hidden="true" />
              <div>
                <strong>Session is persisted</strong>
                <p>Refresh the page — you stay signed in via your stored JWT.</p>
              </div>
            </li>
          </ul>

          <Link to="/" className="btn btn--ghost btn--block">
            Back to home
          </Link>
        </section>
      </div>
    </div>
  );
}
