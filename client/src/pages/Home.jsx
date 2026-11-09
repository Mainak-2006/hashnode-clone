import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Code2,
  Compass,
  Layers,
  PenLine,
  ShieldCheck,
  Sparkles,
  Tags,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';

const FEATURES = [
  {
    icon: PenLine,
    title: 'Markdown-first writing',
    body: 'Draft technical articles in Markdown with live preview and a formatting toolbar.',
  },
  {
    icon: Code2,
    title: 'Code that looks right',
    body: 'Fenced code blocks get syntax highlighting, language labels, and a copy button.',
  },
  {
    icon: Tags,
    title: 'Developer tags',
    body: 'Organize posts by technology and browse a public feed filtered by topic.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by default',
    body: 'Passwords are hashed with bcrypt and sessions use signed, expiring JWTs.',
  },
  {
    icon: Layers,
    title: 'Drafts stay private',
    body: 'Save work in progress and publish only when an article is ready for readers.',
  },
  {
    icon: BookOpen,
    title: 'Author profiles',
    body: 'Showcase your bio, avatar, and published articles on a shareable profile page.',
  },
];

const BTN_PRIMARY =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-violet-500))] px-6 py-3.5 text-base font-semibold whitespace-nowrap text-white no-underline shadow-brand transition-all duration-150 hover:-translate-y-px hover:text-white hover:no-underline hover:shadow-brand-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

const BTN_GHOST =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold whitespace-nowrap text-slate-700 no-underline shadow-soft transition-all duration-150 hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:text-ink-900 hover:no-underline active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

export default function Home() {
  useDocumentTitle('Home');
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white [background-image:radial-gradient(760px_420px_at_12%_-10%,rgba(41,98,255,0.16),transparent_62%),radial-gradient(680px_400px_at_88%_0%,rgba(124,58,237,0.15),transparent_60%)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(var(--color-slate-200)_1px,transparent_1px),linear-gradient(90deg,var(--color-slate-200)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_50%_0%,#000_20%,transparent_78%)]"
          aria-hidden="true"
        />

        <div className="relative z-1 mx-auto w-full max-w-[900px] px-6 py-[92px] text-center max-md:px-[18px] max-md:pt-16 max-md:pb-[54px]">
          <span className="inline-flex items-center gap-[7px] rounded-full border border-[rgba(41,98,255,0.24)] bg-[rgba(41,98,255,0.07)] px-3.5 py-[7px] text-[0.8rem] font-semibold text-brand-600">
            <Sparkles size={15} aria-hidden="true" />
            Developer-first publishing, built on MERN
          </span>

          <h1 className="mt-[22px] text-[clamp(2.15rem,5vw,3.6rem)] font-extrabold leading-[1.08] tracking-[-0.035em]">
            Where developers{' '}
            <span className="bg-[linear-gradient(100deg,var(--color-brand-500)_0%,var(--color-violet-500)_70%)] bg-clip-text text-transparent">
              write, ship, and share
            </span>{' '}
            what they build.
          </h1>

          <p className="mx-auto mt-5 max-w-[640px] text-[1.08rem] text-slate-600">
            Hashnode Clone is a Markdown-powered blogging platform for technical writing: code-heavy
            articles, developer tags, and a public feed — without the noise.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 max-[560px]:flex-col max-[560px]:items-stretch">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={`${BTN_PRIMARY} max-[560px]:w-full`}>
                  Go to your dashboard
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link to="/feed" className={`${BTN_GHOST} max-[560px]:w-full`}>
                  <Compass size={18} aria-hidden="true" />
                  Explore the feed
                </Link>
                <p className="basis-full text-[0.92rem] text-slate-500">
                  Signed in as <strong>{user?.name}</strong>
                </p>
              </>
            ) : (
              <>
                <Link to="/register" className={`${BTN_PRIMARY} max-[560px]:w-full`}>
                  Start writing free
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link to="/feed" className={`${BTN_GHOST} max-[560px]:w-full`}>
                  <Compass size={18} aria-hidden="true" />
                  Explore the feed
                </Link>
                <Link to="/login" className={`${BTN_GHOST} max-[560px]:w-full`}>
                  Log in
                </Link>
              </>
            )}
          </div>

          <dl className="mx-auto mt-[46px] grid max-w-[620px] grid-cols-4 gap-2.5 rounded-[18px] border border-slate-200 bg-white/72 p-[18px] shadow-card backdrop-blur-[8px] max-md:grid-cols-2 max-md:text-center">
            <div>
              <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-slate-500">
                Stack
              </dt>
              <dd className="mt-1 text-[1.05rem] font-bold text-ink-900">MERN</dd>
            </div>
            <div>
              <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-slate-500">
                Authoring
              </dt>
              <dd className="mt-1 text-[1.05rem] font-bold text-ink-900">Markdown</dd>
            </div>
            <div>
              <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-slate-500">
                Sessions
              </dt>
              <dd className="mt-1 text-[1.05rem] font-bold text-ink-900">JWT</dd>
            </div>
            <div>
              <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-slate-500">
                Release
              </dt>
              <dd className="mt-1 text-[1.05rem] font-bold text-ink-900">v1.0</dd>
            </div>
          </dl>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-[1140px] px-6 py-[76px] max-md:px-[18px] max-md:py-14"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto mb-10 max-w-[620px] text-center">
          <h2 id="features-heading" className="text-[clamp(1.6rem,3vw,2.1rem)] font-extrabold">
            Everything a developer blog needs
          </h2>
          <p className="mt-3 text-base text-slate-500">
            Built to scale from a weekend project to a real publishing platform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-[18px] min-[561px]:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-[18px] border border-slate-200 bg-white p-[26px] shadow-soft transition duration-200 hover:-translate-y-[3px] hover:border-[rgba(41,98,255,0.35)] hover:shadow-card"
            >
              <span
                className="mb-4 inline-grid size-[42px] place-items-center rounded-xl bg-[rgba(41,98,255,0.1)] text-brand-600"
                aria-hidden="true"
              >
                <Icon size={20} />
              </span>
              <h3 className="text-[1.05rem] font-bold">{title}</h3>
              <p className="mt-2 text-[0.93rem] text-slate-500">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1140px] px-6 pb-[76px] max-md:px-[18px] max-md:pb-14">
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-[22px] border border-slate-200 bg-[linear-gradient(100deg,rgba(41,98,255,0.09),rgba(124,58,237,0.09))] p-7 shadow-soft max-[560px]:p-5">
          <div className="max-w-[620px]">
            <h2 className="text-[clamp(1.35rem,2.4vw,1.8rem)] font-extrabold">
              Read what developers are building
            </h2>
            <p className="mt-2 text-[0.95rem] text-slate-600">
              Browse the public feed, filter by tag, or search for a topic. No account needed.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link to="/feed" className={BTN_PRIMARY}>
              <Compass size={17} aria-hidden="true" />
              Explore the feed
            </Link>
            <Link to="/tags" className={BTN_GHOST}>
              <Tags size={17} aria-hidden="true" />
              Browse tags
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
