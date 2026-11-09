import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';
import { normalizeLanguage } from './markdownLanguages';

function CopyCodeButton({ code }) {
  const [status, setStatus] = useState('idle');
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleCopy = async () => {
    const copied = await copyToClipboard(code);
    setStatus(copied ? 'copied' : 'error');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus('idle'), 2000);
  };

  const label = status === 'copied' ? 'Copied!' : status === 'error' ? 'Copy failed' : 'Copy code';

  return (
    <button
      type="button"
      className={`md-code__copy${status === 'copied' ? ' is-copied' : ''}${
        status === 'error' ? ' is-error' : ''
      }`}
      onClick={handleCopy}
      aria-label={label}
    >
      {status === 'copied' ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      <span aria-live="polite">{status === 'copied' ? 'Copied!' : status === 'error' ? 'Failed' : 'Copy'}</span>
    </button>
  );
}

function CodeBlock({ language, code }) {
  return (
    <div className="md-code">
      <div className="md-code__header">
        <span className="md-code__language">{language || 'text'}</span>
        <CopyCodeButton code={code} />
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '18px 20px',
          background: 'transparent',
          fontSize: '0.875rem',
          lineHeight: 1.7,
        }}
        codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

const components = {
  // `react-markdown` is intentionally *not* paired with `rehype-raw`: raw
  // HTML in a post is never parsed or rendered.
  pre({ children }) {
    return <>{children}</>;
  },
  code({ node, className, children, ...props }) {
    const match = /language-([\w-]+)/.exec(className || '');
    const code = String(children).replace(/\n$/, '');
    const spansMultipleLines = node?.position?.start?.line !== node?.position?.end?.line;
    const isBlock = Boolean(match) || code.includes('\n') || spansMultipleLines;

    if (!isBlock) {
      return (
        <code className="md-inline-code" {...props}>
          {children}
        </code>
      );
    }

    return <CodeBlock language={normalizeLanguage(match?.[1])} code={code} />;
  },
  a({ node, href = '', children, ...props }) {
    const external = /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
  img({ node, alt = '', ...props }) {
    return <img alt={alt} loading="lazy" {...props} />;
  },
  table({ children }) {
    return (
      <div className="md-table">
        <table>{children}</table>
      </div>
    );
  },
};

/**
 * Render user-authored Markdown with GFM support and Prism highlighting.
 */
export default function MarkdownPreview({ content = '', className = '' }) {
  return (
    <div className={`markdown-body ${className}`.trim()}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
