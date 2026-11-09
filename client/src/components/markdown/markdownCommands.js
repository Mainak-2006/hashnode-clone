/**
 * Pure Markdown formatting helpers used by the editor toolbar.
 *
 * Every command receives `{ value, selectionStart, selectionEnd }` and returns
 * the next value plus the selection that should be restored afterwards.
 */

const headingPattern = /^#{1,6}\s+/;

function wrapSelection(state, before, after, placeholder) {
  const { value, selectionStart: start, selectionEnd: end } = state;
  const selected = value.slice(start, end);
  const body = selected || placeholder;
  const next = value.slice(0, start) + before + body + after + value.slice(end);
  const bodyStart = start + before.length;

  return {
    value: next,
    selectionStart: bodyStart,
    selectionEnd: bodyStart + body.length,
  };
}

function transformLines(state, transform, placeholder, fallbackPrefix = '') {
  const { value, selectionStart: start, selectionEnd: end } = state;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  let lineEnd = value.indexOf('\n', end);
  if (lineEnd === -1) lineEnd = value.length;

  const block = value.slice(lineStart, lineEnd);

  if (!block) {
    const inserted = transform(placeholder);
    const placeholderOffset = inserted.indexOf(placeholder);
    const next = value.slice(0, lineStart) + inserted + value.slice(lineEnd);
    const selectionStart = lineStart + (placeholderOffset >= 0 ? placeholderOffset : fallbackPrefix.length);

    return {
      value: next,
      selectionStart,
      selectionEnd: placeholderOffset >= 0 ? selectionStart + placeholder.length : selectionStart,
    };
  }

  const nextBlock = block.split('\n').map(transform).join('\n');
  const next = value.slice(0, lineStart) + nextBlock + value.slice(lineEnd);

  return {
    value: next,
    selectionStart: lineStart,
    selectionEnd: lineStart + nextBlock.length,
  };
}

function togglePrefix(prefix) {
  return (line) => {
    if (!line.trim()) return line;
    return line.startsWith(prefix) ? line.slice(prefix.length) : prefix + line;
  };
}

function applyHeading(state, level) {
  const marker = `${'#'.repeat(level)} `;
  return transformLines(
    state,
    (line) => {
      if (!line.trim()) return line;
      if (line.startsWith(marker)) return line.slice(marker.length);
      return marker + line.replace(headingPattern, '');
    },
    'Heading',
    marker,
  );
}

function applyLink(state, { image = false } = {}) {
  const { value, selectionStart: start, selectionEnd: end } = state;
  const selected = value.slice(start, end) || (image ? 'alt text' : 'link text');
  const label = image ? `![${selected}]` : `[${selected}]`;
  const url = image ? 'https://example.com/image.png' : 'https://example.com';
  const insertion = `${label}(${url})`;
  const next = value.slice(0, start) + insertion + value.slice(end);
  const urlStart = start + label.length + 1;

  return {
    value: next,
    selectionStart: urlStart,
    selectionEnd: urlStart + url.length,
  };
}

function applyCodeBlock(state) {
  const { value, selectionStart: start, selectionEnd: end } = state;
  const selected = value.slice(start, end);
  const code = selected || 'console.log("hello, world");';
  const before = value.slice(0, start);
  const after = value.slice(end);

  let lead = '';
  if (before.length > 0 && !before.endsWith('\n')) lead = '\n\n';
  else if (before.length > 0 && !before.endsWith('\n\n')) lead = '\n';

  const fence = '```\n';
  const insertion = `${lead}${fence}${code}\n\`\`\`\n`;
  const next = before + insertion + after;
  const codeStart = start + lead.length + fence.length;

  return {
    value: next,
    selectionStart: codeStart,
    selectionEnd: codeStart + code.length,
  };
}

function insertBlock(state, block) {
  const { value, selectionStart: start, selectionEnd: end } = state;
  const before = value.slice(0, start);
  const after = value.slice(end);

  let lead = '';
  if (before.length > 0 && !before.endsWith('\n')) lead = '\n\n';
  else if (before.length > 0 && !before.endsWith('\n\n')) lead = '\n';

  let trail = '';
  if (after.length > 0 && !after.startsWith('\n')) trail = '\n\n';
  else if (after.length > 0 && !after.startsWith('\n\n')) trail = '\n';

  const insertion = `${lead}${block}\n${trail}`.replace(/\n{3,}$/, '\n\n');
  const next = before + insertion + after;
  const caret = start + insertion.length;

  return {
    value: next,
    selectionStart: caret,
    selectionEnd: caret,
  };
}

const TABLE_TEMPLATE = `| Column 1 | Column 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |`;

export const MARKDOWN_COMMANDS = {
  bold: {
    label: 'Bold',
    shortcut: 'Ctrl+B',
    apply: (state) => wrapSelection(state, '**', '**', 'bold text'),
  },
  italic: {
    label: 'Italic',
    shortcut: 'Ctrl+I',
    apply: (state) => wrapSelection(state, '_', '_', 'italic text'),
  },
  strikethrough: {
    label: 'Strikethrough',
    apply: (state) => wrapSelection(state, '~~', '~~', 'strikethrough'),
  },
  heading1: {
    label: 'Heading 1',
    apply: (state) => applyHeading(state, 1),
  },
  heading2: {
    label: 'Heading 2',
    apply: (state) => applyHeading(state, 2),
  },
  heading3: {
    label: 'Heading 3',
    apply: (state) => applyHeading(state, 3),
  },
  quote: {
    label: 'Blockquote',
    apply: (state) => transformLines(state, togglePrefix('> '), 'quoted text', '> '),
  },
  bulletList: {
    label: 'Bulleted list',
    apply: (state) => transformLines(state, togglePrefix('- '), 'list item', '- '),
  },
  orderedList: {
    label: 'Numbered list',
    apply: (state) => transformLines(state, togglePrefix('1. '), 'list item', '1. '),
  },
  inlineCode: {
    label: 'Inline code',
    shortcut: 'Ctrl+E',
    apply: (state) => wrapSelection(state, '`', '`', 'code'),
  },
  codeBlock: {
    label: 'Code block',
    apply: (state) => applyCodeBlock(state),
  },
  link: {
    label: 'Link',
    shortcut: 'Ctrl+K',
    apply: (state) => applyLink(state),
  },
  image: {
    label: 'Image',
    apply: (state) => applyLink(state, { image: true }),
  },
  table: {
    label: 'Table',
    apply: (state) => insertBlock(state, TABLE_TEMPLATE),
  },
  horizontalRule: {
    label: 'Horizontal rule',
    apply: (state) => insertBlock(state, '---'),
  },
};
