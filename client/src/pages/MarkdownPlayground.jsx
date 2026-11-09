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

export default function MarkdownPlayground() {
  useDocumentTitle('Markdown playground');
  const [content, setContent] = useState(SAMPLE);

  return (
    <div className="page container markdown-lab">
      <header className="markdown-lab__header">
        <p className="eyebrow">Day 5 · Markdown</p>
        <h1>Markdown editor &amp; preview</h1>
        <p>
          Try the formatting toolbar, edit the sample, then switch to <strong>Preview</strong> to see
          GFM rendering, Prism highlighting, and the copy-code button.
        </p>
      </header>

      <div className="markdown-lab__grid">
        <section className="panel markdown-lab__editor" aria-label="Markdown editor demo">
          <MarkdownEditor
            id="markdown-lab-content"
            label="Sample post"
            value={content}
            onChange={setContent}
            rows={18}
            hint="Ctrl/Cmd + B, I, E, or K applies bold, italic, inline code, or a link."
          />
        </section>

        <aside className="panel markdown-lab__tips" aria-label="Markdown tips">
          <h2>What to test</h2>
          <ul>
            {TIPS.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <span className="markdown-lab__tip-icon">
                  <Icon size={17} aria-hidden="true" />
                </span>
                <div>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="markdown-lab__note">
            <CheckCircle2 size={15} aria-hidden="true" />
            The full post editor and dashboard arrive on Day 6.
          </p>
        </aside>
      </div>
    </div>
  );
}
