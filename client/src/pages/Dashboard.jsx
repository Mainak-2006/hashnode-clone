import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, FileCode2, LogOut, Mail, PenSquare, ShieldCheck, UserRound } from 'lucide-react';
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

const BTN_GHOST =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-[18px] py-[11px] text-[0.94rem] font-semibold whitespace-nowrap text-slate-700 no-underline shadow-soft transition-all duration-150 hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:text-ink-900 hover:no-underline active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

const ROW =
  'flex items-baseline justify-between gap-5 border-b border-dashed border-slate-200 py-[13px] last:border-b-0 last:pb-0 max-[560px]:flex-col max-[560px]:gap-1';
const DT = 'flex items-center gap-2 text-[0.86rem] font-medium text-slate-500';
const DD =
  'm-0 text-right text-[0.92rem] font-semibold text-ink-800 [overflow-wrap:anywhere] max-[560px]:text-left';

export default function Dashboard() {
  useDocumentTitle('Dashboard');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-[1040px] px-6 pt-14 pb-[72px] max-md:px-[18px] max-[560px]:pt-10 max-[560px]:pb-14">
      <header className="flex flex-wrap items-start justify-between gap-5 border-b border-slate-200 pb-[30px] max-[560px]:flex-col">
        <div className="flex items-center gap-5 max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-3.5">
          <Avatar name={user?.name} src={user?.avatarUrl} size={64} />
          <div>
            <p className="mb-1.5 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-brand-600">
              Dashboard
            </p>
            <h1 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold">
              Welcome back, {user?.name?.split(' ')[0] || 'developer'} 👋
            </h1>
            <p className="mt-2 text-[0.94rem] text-slate-500">
              Your account is set up. The Markdown editor is ready to try.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link to="/markdown" className={BTN_GHOST}>
            <FileCode2 size={17} aria-hidden="true" />
            Markdown lab
          </Link>
          <button type="button" className={BTN_GHOST} onClick={handleLogout}>
            <LogOut size={17} aria-hidden="true" />
            Log out
          </button>
        </div>
      </header>

      <div className="mt-[30px] grid grid-cols-[1.15fr_0.85fr] gap-5 max-lg:grid-cols-1">
        <section
          className="rounded-[18px] border border-slate-200 bg-white p-[26px] shadow-soft"
          aria-labelledby="profile-heading"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 id="profile-heading" className="text-[1.08rem] font-bold">
              Account details
            </h2>
            <span className="inline-flex items-center gap-[5px] rounded-full bg-emerald-50 px-2.5 py-[5px] text-[0.73rem] font-bold uppercase tracking-[0.04em] text-emerald-700">
              <ShieldCheck size={14} aria-hidden="true" />
              Authenticated
            </span>
          </div>

          <dl className="flex flex-col gap-0.5">
            <div className={ROW}>
              <dt className={DT}>
                <UserRound size={16} aria-hidden="true" />
                Name
              </dt>
              <dd className={DD}>{user?.name || '—'}</dd>
            </div>
            <div className={ROW}>
              <dt className={DT}>
                <Mail size={16} aria-hidden="true" />
                Email
              </dt>
              <dd className={DD}>{user?.email || '—'}</dd>
            </div>
            <div className={ROW}>
              <dt className={DT}>
                <CalendarDays size={16} aria-hidden="true" />
                Member since
              </dt>
              <dd className={DD}>{formatDate(user?.createdAt)}</dd>
            </div>
            <div className={ROW}>
              <dt className={DT}>Bio</dt>
              <dd className={DD}>
                {user?.bio || <span className="text-slate-500">No bio yet — editing lands in Phase 3.</span>}
              </dd>
            </div>
          </dl>
        </section>

        <section
          className="rounded-[18px] border border-slate-200 bg-white p-[26px] shadow-soft"
          aria-labelledby="next-heading"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 id="next-heading" className="text-[1.08rem] font-bold">
              What’s next
            </h2>
          </div>

          <ul className="mb-[22px] flex flex-col gap-4">
            <li className="flex gap-3">
              <PenSquare size={17} className="mt-[3px] shrink-0 text-brand-600" aria-hidden="true" />
              <div>
                <strong className="text-[0.93rem] text-ink-900">Write your first post</strong>
                <p className="mt-[3px] text-[0.86rem] text-slate-500">
                  Markdown editor and drafts arrive in Phase 2.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <PenSquare size={17} className="mt-[3px] shrink-0 text-brand-600" aria-hidden="true" />
              <div>
                <strong className="text-[0.93rem] text-ink-900">Publish to the feed</strong>
                <p className="mt-[3px] text-[0.86rem] text-slate-500">
                  Public feed, tags, and search arrive in Phase 3.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <ShieldCheck size={17} className="mt-[3px] shrink-0 text-brand-600" aria-hidden="true" />
              <div>
                <strong className="text-[0.93rem] text-ink-900">Session is persisted</strong>
                <p className="mt-[3px] text-[0.86rem] text-slate-500">
                  Refresh the page — you stay signed in via your stored JWT.
                </p>
              </div>
            </li>
          </ul>

          <Link to="/" className={`${BTN_GHOST} w-full`}>
            Back to home
          </Link>
        </section>
      </div>
    </div>
  );
}
