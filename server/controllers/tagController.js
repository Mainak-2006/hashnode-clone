const Tag = require('../models/Tag');
const Post = require('../models/Post');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const slugify = require('../utils/slugify');
const { POST_POPULATE } = require('../utils/populate');
const { parsePagination, buildPagination } = require('../utils/pagination');

/**
 * GET /api/tags
 * Public. All tags with their published-post counts, most used first.
 */
const listTags = asyncHandler(async (_req, res) => {
  const tags = await Tag.find().sort({ name: 1 });

  const counts = await Post.aggregate([
    { $match: { status: 'published' } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
  ]);

  const countByTag = new Map(counts.map((item) => [item._id.toString(), item.count]));

  const payload = tags
    .map((tag) => ({
      id: tag._id.toString(),
      name: tag.name,
      slug: tag.slug,
      count: countByTag.get(tag._id.toString()) || 0,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  res.json({ tags: payload });
});

/**
 * GET /api/tags/:slug/posts
 * Public. Published posts under one tag, newest first, paginated.
 */
const getTagPosts = asyncHandler(async (req, res) => {
  const tag = await Tag.findOne({ slug: slugify(req.params.slug) });

  if (!tag) {
    throw new ApiError(404, 'Tag not found');
  }

  const { page, limit } = parsePagination(req.query);
  const filter = { status: 'published', tags: tag._id };

  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate(POST_POPULATE);

  res.json({
    tag: {
      id: tag._id.toString(),
      name: tag.name,
      slug: tag.slug,
    },
    posts,
    pagination: buildPagination(page, limit, total),
  });
});

module.exports = { listTags, getTagPosts };
