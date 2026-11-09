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
    <div className={`md-editor${error ? ' md-editor--error' : ''} ${className}`.trim()}>
      <div className="md-editor__header">
        <label className="md-editor__label" htmlFor={fieldId}>
          {label}
        </label>

        {withPreview && (
          <div className="md-editor__tabs" role="tablist" aria-label="Editing mode">
            <button
              type="button"
              role="tab"
              id={`${fieldId}-write-tab`}
              aria-selected={mode === 'write'}
              aria-controls={`${fieldId}-write`}
              className="md-editor__tab"
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
              className="md-editor__tab"
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
          <div className="md-editor__toolbar" role="toolbar" aria-label="Markdown formatting">
            {TOOLBAR_GROUPS.map((group, index) => (
              <div className="md-editor__toolbar-group" key={index}>
                {group.map(({ command: commandId, icon: Icon }) => {
                  const command = MARKDOWN_COMMANDS[commandId];
                  const title = command.shortcut ? `${command.label} (${command.shortcut})` : command.label;
                  return (
                    <button
                      key={commandId}
                      type="button"
                      className="md-editor__tool"
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
            className="md-editor__textarea"
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
          className="md-editor__preview"
        >
          {value.trim() ? (
            <MarkdownPreview content={value} />
          ) : (
            <p className="md-editor__empty">Nothing to preview yet — start writing in the Write tab.</p>
          )}
        </div>
      )}

      <div className="md-editor__footer">
        <span>
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
        <span>Markdown + GFM supported</span>
      </div>

      {error && (
        <p className="field__error md-editor__message" id={errorId}>
          {error}
        </p>
      )}
      {hint && !error && <p className="field__hint md-editor__message">{hint}</p>}
    </div>
  );
}
