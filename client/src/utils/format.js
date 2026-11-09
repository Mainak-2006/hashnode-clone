export function formatDate(value, options = {}) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

export function formatLongDate(value) {
  return formatDate(value, { month: 'long' });
}

export function readingTimeLabel(minutes) {
  const value = Number(minutes) || 1;
  return `${value} min read`;
}

export function postPath(slug) {
  return `/posts/${slug}`;
}

export function profilePath(id) {
  return id ? `/u/${id}` : '/feed';
}

export function tagPath(slug) {
  return `/tags/${slug}`;
}
