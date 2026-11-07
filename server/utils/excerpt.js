/**
 * Strip common Markdown syntax and condense the result into a plain-text excerpt.
 */
const stripMarkdown = (content = '') =>
  String(content)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/[*_~]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const buildExcerpt = (content, maxLength = 200) => {
  const text = stripMarkdown(content);

  if (!text) return '';
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trimEnd()}…`;
};

module.exports = buildExcerpt;
module.exports.stripMarkdown = stripMarkdown;
