import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';
import { normalizeLanguage } from './markdownLanguages';

const HEADING = 'mt-[1.6em] mb-[0.6em] font-bold leading-[1.25] tracking-[-0.02em] text-ink-900';
const LIST_ITEM = 'my-[0.35em] [&>ol]:my-[0.3em] [&>ul]:my-[0.3em]';

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

  const stateClass =
    status === 'copied'
      ? 'border-[rgba(124,224,176,0.4)] text-[#7ce0b0]'
      : status === 'error'
        ? 'border-[rgba(252,165,165,0.4)] text-[#fca5a5]'
        : '';

  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-[7px] border border-white/12 bg-white/[0.06] px-2.5 py-[5px] text-[0.74rem] font-semibold text-slate-300 transition-colors hover:bg-white/[0.13] hover:text-white ${stateClass}`}
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
    <div className="my-[1.4em] overflow-hidden rounded-xl border border-[rgba(15,23,42,0.45)] bg-[#282c34] shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-3 py-[7px] pl-4">
        <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.08em] text-slate-400">
          {language || 'text'}
        </span>
        <CopyCodeButton code={code} />
      </div>
      <div className="overflow-x-auto">
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
    </div>
  );
}

const components = {
  // `react-markdown` is intentionally *not* paired with `rehype-raw`: raw
  // HTML in a post is never parsed or rendered.
  pre({ children }) {
    return <>{children}</>;
  },
  h1({ node, children, ...props }) {
    return (
      <h1 className={`${HEADING} text-[1.85rem]`} {...props}>
        {children}
      </h1>
    );
  },
  h2({ node, children, ...props }) {
    return (
      <h2 className={`${HEADING} text-[1.45rem]`} {...props}>
        {children}
      </h2>
    );
  },
  h3({ node, children, ...props }) {
    return (
      <h3 className={`${HEADING} text-[1.18rem]`} {...props}>
        {children}
      </h3>
    );
  },
  h4({ node, children, ...props }) {
    return (
      <h4 className={`${HEADING} text-base`} {...props}>
        {children}
      </h4>
    );
  },
  p({ node, children, ...props }) {
    return (
      <p className="my-4" {...props}>
        {children}
      </p>
    );
  },
  ul({ node, children, ...props }) {
    return (
      <ul className="my-4 list-disc pl-6" {...props}>
        {children}
      </ul>
    );
  },
  ol({ node, children, ...props }) {
    return (
      <ol className="my-4 list-decimal pl-6" {...props}>
        {children}
      </ol>
    );
  },
  li({ node, className, children, ...props }) {
    const isTask = className?.includes('task-list-item');
    return (
      <li className={`${LIST_ITEM} ${isTask ? '-ml-5 list-none' : ''} ${className || ''}`.trim()} {...props}>
        {children}
      </li>
    );
  },
  input({ node, ...props }) {
    return <input className="mr-2 accent-brand-500" {...props} />;
  },
  blockquote({ node, children, ...props }) {
    return (
      <blockquote
        className="my-[1.3em] rounded-r-lg border-l-[3px] border-brand-500 bg-slate-50 px-[1.1em] py-[0.65em] text-slate-600 [&_p]:my-[0.35em]"
        {...props}
      >
        {children}
      </blockquote>
    );
  },
  a({ node, href = '', children, ...props }) {
    const external = /^https?:\/\//i.test(href);
    return (
      <a
        className="text-brand-600 underline underline-offset-2"
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
  hr({ node, ...props }) {
    return <hr className="my-8 h-0 border-t border-slate-200" {...props} />;
  },
  img({ node, alt = '', ...props }) {
    return (
      <img
        className="mx-auto my-[1.2em] max-w-full rounded-xl shadow-soft"
        alt={alt}
        loading="lazy"
        {...props}
      />
    );
  },
  code({ node, className, children, ...props }) {
    const match = /language-([\w-]+)/.exec(className || '');
    const code = String(children).replace(/\n$/, '');
    const spansMultipleLines = node?.position?.start?.line !== node?.position?.end?.line;
    const isBlock = Boolean(match) || code.includes('\n') || spansMultipleLines;

    if (!isBlock) {
      return (
        <code
          className="rounded-[5px] bg-slate-100 px-[0.4em] py-[0.15em] font-mono text-[0.86em] text-rose-700"
          {...props}
        >
          {children}
        </code>
      );
    }

    return <CodeBlock language={normalizeLanguage(match?.[1])} code={code} />;
  },
  table({ children }) {
    return (
      <div className="my-[1.4em] overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full border-collapse text-[0.9rem]">{children}</table>
      </div>
    );
  },
  thead({ node, children, ...props }) {
    return <thead {...props}>{children}</thead>;
  },
  tr({ node, children, ...props }) {
    return (
      <tr className="[&:last-child>td]:border-b-0" {...props}>
        {children}
      </tr>
    );
  },
  th({ node, children, ...props }) {
    return (
      <th
        className="border-b border-slate-200 bg-slate-50 px-3.5 py-2.5 text-left align-top font-bold text-ink-900"
        {...props}
      >
        {children}
      </th>
    );
  },
  td({ node, children, ...props }) {
    return (
      <td className="border-b border-slate-200 px-3.5 py-2.5 text-left align-top" {...props}>
        {children}
      </td>
    );
  },
};

/**
 * Render user-authored Markdown with GFM support and Prism highlighting.
 */
export default function MarkdownPreview({ content = '', className = '' }) {
  return (
    <div
      className={`text-base leading-[1.75] text-ink-800 [overflow-wrap:break-word] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 ${className}`.trim()}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
