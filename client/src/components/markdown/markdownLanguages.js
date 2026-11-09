import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';

import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import clike from 'react-syntax-highlighter/dist/esm/languages/prism/clike';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import diff from 'react-syntax-highlighter/dist/esm/languages/prism/diff';
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';

/**
 * Prism grammars bundled with the light build.
 *
 * Ordering matters: several grammars extend `clike` / `javascript` / `markup`,
 * so those dependencies are registered first.
 */
const GRAMMARS = [
  ['clike', clike, []],
  ['markup', markup, ['html', 'xml', 'svg']],
  ['css', css, []],
  ['javascript', javascript, ['js']],
  ['typescript', typescript, ['ts']],
  ['jsx', jsx, ['react']],
  ['tsx', tsx, []],
  ['python', python, ['py']],
  ['json', json, []],
  ['bash', bash, ['sh', 'shell', 'zsh']],
  ['markdown', markdown, ['md']],
  ['yaml', yaml, ['yml']],
  ['sql', sql, []],
  ['java', java, []],
  ['c', c, []],
  ['cpp', cpp, ['c++']],
  ['csharp', csharp, ['cs', 'c#']],
  ['go', go, ['golang']],
  ['rust', rust, ['rs']],
  ['ruby', ruby, ['rb']],
  ['php', php, []],
  ['diff', diff, ['patch']],
  ['docker', docker, ['dockerfile']],
];

for (const [name, grammar, aliases] of GRAMMARS) {
  SyntaxHighlighter.registerLanguage(name, grammar);
  if (aliases.length > 0) SyntaxHighlighter.alias(name, aliases);
}

/**
 * Common fence aliases → registered Prism grammar names.
 * Unknown languages fall through and are rendered as plain text by the
 * highlighter instead of throwing.
 */
const ALIASES = {
  js: 'javascript',
  javascript: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  typescript: 'typescript',
  tsx: 'tsx',
  py: 'python',
  python: 'python',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  bash: 'bash',
  html: 'markup',
  xml: 'markup',
  svg: 'markup',
  markup: 'markup',
  md: 'markdown',
  markdown: 'markdown',
  yml: 'yaml',
  yaml: 'yaml',
  'c++': 'cpp',
  cpp: 'cpp',
  cs: 'csharp',
  'c#': 'csharp',
  csharp: 'csharp',
  golang: 'go',
  rs: 'rust',
  rb: 'ruby',
  patch: 'diff',
  dockerfile: 'docker',
};

export function normalizeLanguage(language) {
  if (!language) return '';
  const key = String(language).trim().toLowerCase();
  return ALIASES[key] || key;
}
