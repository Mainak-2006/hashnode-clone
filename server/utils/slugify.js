/**
 * Convert arbitrary text into a URL-safe slug.
 * "Building a REST API with Express!" -> "building-a-rest-api-with-express"
 */
const slugify = (value = '') =>
  String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80)
    .replace(/-+$/g, '');

module.exports = slugify;
