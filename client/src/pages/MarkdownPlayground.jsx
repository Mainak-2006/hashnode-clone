import { useState } from 'react';
import { CheckCircle2, Code2, ShieldCheck, Table2 } from 'lucide-react';
import MarkdownEditor from '../components/markdown/MarkdownEditor';
import useDocumentTitle from '../hooks/useDocumentTitle';

const SAMPLE = `# Building with Markdown

A **bold** idea, an _italic_ aside, and ~~struck-through~~ text.

## What the editor supports

- GFM tables and task lists
- Fenced code blocks with Prism highlighting
- Links, images, blockquotes, and headings

- [x] Write in Markdown
- [ ] Publish the post

> Blockquotes keep long asides readable.

### JavaScript

\`\`\`js
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet('Hashnode'));
\`\`\`

### Python

\`\`\`python
def reading_time(words: int) -> int:
    return max(1, round(words / 200))
\`\`\`

### Bash

\`\`\`bash
npm run dev --prefix server
\`\`\`

| Feature | Status |
| --- | --- |
| Tables | ✅ |
| Syntax highlighting | ✅ |
| Copy code | ✅ |

1. Write in Markdown
2. Switch to **Preview**
3. Publish

[React Markdown](https://github.com/remarkjs/react-markdown) renders the preview.

---
`;

const TIPS = [
  {
    icon: Code2,
    title: 'Formatting toolbar',
    body: 'Headings, lists, quotes, links, tables, and code fences insert clean Markdown around your selection.',
  },
  {
    icon: Table2,
    title: 'GitHub-flavored Markdown',
    body: 'Tables, task lists, strikethrough, and autolinks render through remark-gfm.',
  },
  {
    icon: ShieldCheck,
    title: 'Raw HTML stays inert',
    body: 'The preview never uses rehype-raw, so embedded HTML is skipped instead of rendered.',
  },
];

const PANEL = 'rounded-[18px] border border-slate-200 bg-white p-[26px] shadow-soft';

export default function MarkdownPlayground() {
  useDocumentTitle('Markdown playground');
  const [content, setContent] = useState(SAMPLE);

  return (
    <div className="mx-auto w-full max-w-[1160px] px-6 pt-14 pb-[72px] max-md:px-[18px] max-[560px]:pt-10 max-[560px]:pb-14">
      <header className="mb-[30px] max-w-[640px]">
        <p className="mb-1.5 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-brand-600">
          Day 5 · Markdown
        </p>
        <h1 className="text-[clamp(1.7rem,3vw,2.25rem)] font-extrabold">Markdown editor &amp; preview</h1>
        <p className="mt-3 text-[0.98rem] text-slate-500">
          Try the formatting toolbar, edit the sample, then switch to <strong>Preview</strong> to see
          GFM rendering, Prism highlighting, and the copy-code button.
        </p>
      </header>

      <div className="grid grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)] items-start gap-5 max-lg:grid-cols-1">
        <section
          className={`${PANEL} p-[18px] max-[560px]:p-3`}
          aria-label="Markdown editor demo"
        >
          <MarkdownEditor
            id="markdown-lab-content"
            label="Sample post"
            value={content}
            onChange={setContent}
            rows={18}
            hint="Ctrl/Cmd + B, I, E, or K applies bold, italic, inline code, or a link."
          />
        </section>

        <aside className={PANEL} aria-label="Markdown tips">
          <h2 className="text-[1.05rem] font-bold">What to test</h2>
          <ul className="mt-[18px] flex flex-col gap-[18px]">
            {TIPS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-[rgba(41,98,255,0.1)] text-brand-600">
                  <Icon size={17} aria-hidden="true" />
                </span>
                <div>
                  <strong className="text-[0.91rem] text-ink-900">{title}</strong>
                  <p className="mt-[3px] text-[0.84rem] text-slate-500">{body}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-[22px] flex items-center gap-2 border-t border-dashed border-slate-200 pt-4 text-[0.8rem] text-slate-500">
            <CheckCircle2 size={15} className="shrink-0 text-emerald-700" aria-hidden="true" />
            The full post editor and dashboard arrive on Day 6.
          </p>
        </aside>
      </div>
    </div>
  );
}
