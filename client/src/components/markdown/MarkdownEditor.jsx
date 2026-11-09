import { useEffect, useId, useRef, useState } from 'react';
import {
  Bold,
  Code,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  PencilLine,
  Quote,
  SquareCode,
  Strikethrough,
  Table,
} from 'lucide-react';
import MarkdownPreview from './MarkdownPreview';
import { MARKDOWN_COMMANDS } from './markdownCommands';

const TOOLBAR_GROUPS = [
  [
    { command: 'bold', icon: Bold },
    { command: 'italic', icon: Italic },
    { command: 'strikethrough', icon: Strikethrough },
  ],
  [
    { command: 'heading1', icon: Heading1 },
    { command: 'heading2', icon: Heading2 },
    { command: 'heading3', icon: Heading3 },
  ],
  [
    { command: 'quote', icon: Quote },
    { command: 'bulletList', icon: List },
    { command: 'orderedList', icon: ListOrdered },
  ],
  [
    { command: 'inlineCode', icon: Code },
    { command: 'codeBlock', icon: SquareCode },
  ],
  [
    { command: 'link', icon: Link },
    { command: 'image', icon: Image },
    { command: 'table', icon: Table },
    { command: 'horizontalRule', icon: Minus },
  ],
];

const KEYBOARD_SHORTCUTS = {
  b: 'bold',
  i: 'italic',
  e: 'inlineCode',
  k: 'link',
};

const tabClass = (selected) =>
  `inline-flex cursor-pointer items-center gap-1.5 rounded-full border-0 px-3 py-1.5 text-[0.8rem] font-semibold transition-colors ${
    selected
      ? 'bg-ink-900 text-white hover:bg-ink-900 hover:text-white'
      : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-ink-900'
  }`;

export default function MarkdownEditor({
  id,
  label = 'Content',
  value = '',
  onChange,
  placeholder = 'Write your post in Markdown…',
  disabled = false,
  error,
  hint,
  rows = 14,
  withPreview = true,
  className = '',
}) {
  const generatedId = useId();
  const fieldId = id || `markdown-${generatedId}`;
  const errorId = `${fieldId}-error`;
  const textareaRef = useRef(null);
  const pendingSelection = useRef(null);
  const [mode, setMode] = useState('write');

  useEffect(() => {
    if (mode !== 'write' || !pendingSelection.current) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end } = pendingSelection.current;
    pendingSelection.current = null;
    textarea.focus();
    textarea.setSelectionRange(start, end);
  }, [value, mode]);

  const applyCommand = (commandId) => {
    const textarea = textareaRef.current;
    const command = MARKDOWN_COMMANDS[commandId];
    if (!textarea || !command || disabled) return;

    const result = command.apply({
      value,
      selectionStart: textarea.selectionStart,
      selectionEnd: textarea.selectionEnd,
    });

    pendingSelection.current = { start: result.selectionStart, end: result.selectionEnd };
    setMode('write');
    onChange?.(result.value);
  };

  const handleKeyDown = (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.altKey) return;
    const commandId = KEYBOARD_SHORTCUTS[event.key.toLowerCase()];
    if (!commandId) return;
    event.preventDefault();
    applyCommand(commandId);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div
      className={`overflow-hidden rounded-[18px] border bg-white shadow-soft transition-[border-color,box-shadow] ${
        error
          ? 'border-red-200 bg-red-50 focus-within:border-red-700 focus-within:shadow-ring-danger'
          : 'border-slate-200 focus-within:border-brand-500 focus-within:shadow-ring'
      } ${className}`.trim()}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <label className="text-[0.86rem] font-semibold text-slate-700" htmlFor={fieldId}>
          {label}
        </label>

        {withPreview && (
          <div
            className="flex gap-0.5 rounded-full border border-slate-200 bg-white p-[3px]"
            role="tablist"
            aria-label="Editing mode"
          >
            <button
              type="button"
              role="tab"
              id={`${fieldId}-write-tab`}
              aria-selected={mode === 'write'}
              aria-controls={`${fieldId}-write`}
              className={tabClass(mode === 'write')}
              onClick={() => setMode('write')}
            >
              <PencilLine size={14} aria-hidden="true" />
              Write
            </button>
            <button
              type="button"
              role="tab"
              id={`${fieldId}-preview-tab`}
              aria-selected={mode === 'preview'}
              aria-controls={`${fieldId}-preview`}
              className={tabClass(mode === 'preview')}
              onClick={() => setMode('preview')}
            >
              <Eye size={14} aria-hidden="true" />
              Preview
            </button>
          </div>
        )}
      </div>

      {mode === 'write' ? (
        <div id={`${fieldId}-write`} role="tabpanel" aria-labelledby={`${fieldId}-write-tab`}>
          <div
            className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-white px-2.5 py-[7px] max-[560px]:flex-nowrap max-[560px]:overflow-x-auto"
            role="toolbar"
            aria-label="Markdown formatting"
          >
            {TOOLBAR_GROUPS.map((group, index) => (
              <div
                className="mr-1 flex items-center gap-0.5 border-r border-slate-200 pr-2 last:mr-0 last:border-r-0 last:pr-0 max-[560px]:shrink-0"
                key={index}
              >
                {group.map(({ command: commandId, icon: Icon }) => {
                  const command = MARKDOWN_COMMANDS[commandId];
                  const title = command.shortcut ? `${command.label} (${command.shortcut})` : command.label;
                  return (
                    <button
                      key={commandId}
                      type="button"
                      className="grid size-[34px] cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-slate-600 transition-colors hover:bg-slate-100 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-45"
                      title={title}
                      aria-label={command.label}
                      disabled={disabled}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => applyCommand(commandId)}
                    >
                      <Icon size={17} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <textarea
            ref={textareaRef}
            id={fieldId}
            className="block min-h-[280px] w-full resize-y border-0 bg-white px-5 py-[18px] font-mono text-[0.9rem] leading-[1.7] text-ink-900 tab-2 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-500"
            value={value}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => onChange?.(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      ) : (
        <div
          id={`${fieldId}-preview`}
          role="tabpanel"
          aria-labelledby={`${fieldId}-preview-tab`}
          className="max-h-[640px] min-h-[280px] overflow-y-auto px-7 py-[26px] max-md:px-5 max-md:py-5 max-[560px]:px-[18px]"
        >
          {value.trim() ? (
            <MarkdownPreview content={value} />
          ) : (
            <p className="m-0 py-16 text-center text-[0.9rem] text-slate-400">
              Nothing to preview yet — start writing in the Write tab.
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-[9px] text-[0.76rem] text-slate-500">
        <span>
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
        <span>Markdown + GFM supported</span>
      </div>

      {error && (
        <p className="m-0 px-4 pb-3 text-[0.8rem] text-red-700" id={errorId}>
          {error}
        </p>
      )}
      {hint && !error && <p className="m-0 px-4 pb-3 text-[0.8rem] text-slate-500">{hint}</p>}
    </div>
  );
}
