import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code2, Layers, PenLine, ShieldCheck, Sparkles, Tags } from 'lucide-react';
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

export default function Home() {
  useDocumentTitle('Home');
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <span className="hero__eyebrow">
            <Sparkles size={15} aria-hidden="true" />
            Developer-first publishing, built on MERN
          </span>

          <h1 className="hero__title">
            Where developers <span className="text-gradient">write, ship, and share</span> what they
            build.
          </h1>

          <p className="hero__lede">
            Hashnode Clone is a Markdown-powered blogging platform for technical writing: code-heavy
            articles, developer tags, and a public feed — without the noise.
          </p>

          <div className="hero__actions">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn--primary btn--lg">
                  Go to your dashboard
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <p className="hero__welcome">
                  Signed in as <strong>{user?.name}</strong>
                </p>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn--primary btn--lg">
                  Start writing free
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link to="/login" className="btn btn--ghost btn--lg">
                  Log in
                </Link>
              </>
            )}
          </div>

          <dl className="hero__stats">
            <div>
              <dt>Stack</dt>
              <dd>MERN</dd>
            </div>
            <div>
              <dt>Authoring</dt>
              <dd>Markdown</dd>
            </div>
            <div>
              <dt>Sessions</dt>
              <dd>JWT</dd>
            </div>
            <div>
              <dt>Phase</dt>
              <dd>1 of 4</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section container" aria-labelledby="features-heading">
        <div className="section__header">
          <h2 id="features-heading">Everything a developer blog needs</h2>
          <p>Built to scale from a weekend project to a real publishing platform.</p>
        </div>

        <div className="card-grid">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article className="feature-card" key={title}>
              <span className="feature-card__icon" aria-hidden="true">
                <Icon size={20} />
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
