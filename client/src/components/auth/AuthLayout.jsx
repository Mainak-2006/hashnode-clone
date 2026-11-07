import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Brand from '../Brand';

const POINTS = [
  'Write in Markdown with live preview',
  'Organize posts with developer tags',
  'Publish a public feed of your articles',
  'Secure JWT authentication out of the box',
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <section className="auth__panel" aria-hidden="false">
        <Brand size="lg" />
        <div className="auth__panel-copy">
          <h2>Where developers share what they build.</h2>
          <p>
            A clean, fast place to write technical articles, publish code-heavy posts, and grow your
            developer profile.
          </p>
          <ul className="auth__points">
            {POINTS.map((point) => (
              <li key={point}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="auth__panel-foot">MERN stack · Markdown · Syntax highlighting</p>
      </section>

      <section className="auth__content">
        <div className="auth__card">
          <header className="auth__header">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </header>

          {children}

          {footer && <div className="auth__footer">{footer}</div>}
        </div>

        <p className="auth__back">
          <Link to="/">← Back to home</Link>
        </p>
      </section>
    </div>
  );
}
