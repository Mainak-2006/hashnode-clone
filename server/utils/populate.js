const POST_POPULATE = [
  { path: 'author', select: 'name avatarUrl bio' },
  { path: 'tags', select: 'name slug' },
];

module.exports = { POST_POPULATE };
