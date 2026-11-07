const mongoose = require('mongoose');
const Post = require('../models/Post');
const Tag = require('../models/Tag');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const slugify = require('../utils/slugify');
const buildExcerpt = require('../utils/excerpt');
const { POST_POPULATE } = require('../utils/populate');
const { parsePagination, buildPagination } = require('../utils/pagination');

const MAX_TAGS = 5;
const POST_STATUSES = ['draft', 'published'];

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const assertStatus = (status) => {
  if (status !== undefined && !POST_STATUSES.includes(status)) {
    throw new ApiError(400, `Status must be one of: ${POST_STATUSES.join(', ')}`);
  }
};

const assertObjectId = (id, label = 'post') => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, `Invalid ${label} id`);
  }
};

/**
 * Generate a unique slug, appending -2, -3, ... when the base is taken.
 */
const generateUniqueSlug = async (title, excludeId = null) => {
  const base = slugify(title) || 'post';
  let candidate = base;
  let suffix = 1;

  // eslint-disable-next-line no-await-in-loop
  while (
    await Post.exists({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    suffix += 1;
    candidate = `${base}-${suffix}`;

    if (suffix > 500) {
      candidate = `${base}-${Date.now().toString(36)}`;
      break;
    }
  }

  return candidate;
};

const toTagName = (raw) => {
  if (typeof raw === 'string') return raw;
  if (raw && typeof raw === 'object' && typeof raw.name === 'string') return raw.name;
  return '';
};

/**
 * Resolve tag names/slugs into Tag documents, creating missing tags.
 * Returns an array of ObjectIds (max 5, duplicates removed).
 */
const resolveTags = async (rawTags) => {
  if (rawTags === undefined) return undefined;
  // null is an explicit "clear the tags" request.
  if (rawTags === null) return [];

  if (!Array.isArray(rawTags)) {
    throw new ApiError(400, 'Tags must be an array of tag names');
  }

  const seen = new Set();
  const normalized = [];

  for (const raw of rawTags) {
    const name = toTagName(raw).trim().replace(/^#+/, '').trim();
    if (!name) {
      throw new ApiError(400, 'Tag names cannot be empty');
    }

    const slug = slugify(name);
    if (!slug) {
      throw new ApiError(400, `Invalid tag name: ${name}`);
    }
    if (slug.length > 80) {
      throw new ApiError(400, 'Tag names cannot be longer than 80 characters');
    }
    if (seen.has(slug)) continue;

    seen.add(slug);
    normalized.push({ name: name.toLowerCase(), slug });
  }

  if (normalized.length > MAX_TAGS) {
    throw new ApiError(400, `A post can have at most ${MAX_TAGS} tags`);
  }

  const ids = [];

  for (const item of normalized) {
    let tag = await Tag.findOne({
      $or: [{ slug: item.slug }, { name: item.name }],
    });

    if (!tag) {
      try {
        tag = await Tag.create(item);
      } catch (error) {
        // Another request may have created the same tag between find and create.
        if (error.code === 11000) {
          tag = await Tag.findOne({
            $or: [{ slug: item.slug }, { name: item.name }],
          });
        } else {
          throw error;
        }
      }
    }

    if (tag) ids.push(tag._id);
  }

  return ids;
};

const findOwnedPost = async (id, userId) => {
  assertObjectId(id);

  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (post.author.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only manage your own posts');
  }

  return post;
};

/**
 * POST /api/posts
 * Protected. Creates a draft or published post for the current user.
 */
const createPost = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const title = normalizeText(body.title);
  const content = normalizeText(body.content);

  if (!title) throw new ApiError(400, 'Title is required');
  if (!content) throw new ApiError(400, 'Content is required');

  assertStatus(body.status);

  const status = body.status || 'draft';
  const tagIds = await resolveTags(body.tags === undefined ? [] : body.tags);
  const slug = await generateUniqueSlug(title);

  const post = await Post.create({
    title,
    slug,
    content,
    excerpt: buildExcerpt(content),
    coverImage: normalizeText(body.coverImage),
    status,
    author: req.user._id,
    tags: tagIds,
  });

  await post.populate(POST_POPULATE);

  res.status(201).json({
    message: 'Post created successfully',
    post: post.toJSON(),
  });
});

/**
 * GET /api/posts
 * Public. Published posts only, newest first, paginated.
 * Optional query: search (title), tag (slug).
 */
const listPosts = asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const filter = { status: 'published' };

  const search = normalizeText(req.query.search || req.query.q);
  if (search) {
    filter.title = { $regex: escapeRegExp(search), $options: 'i' };
  }

  const tagQuery = normalizeText(req.query.tag);
  if (tagQuery) {
    const tag = await Tag.findOne({ slug: slugify(tagQuery) });
    if (!tag) {
      return res.json({
        posts: [],
        pagination: buildPagination(page, limit, 0),
      });
    }
    filter.tags = tag._id;
  }

  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate(POST_POPULATE);

  return res.json({
    posts,
    pagination: buildPagination(page, limit, total),
  });
});

/**
 * GET /api/posts/mine
 * Protected. Drafts and published posts belonging to the current user.
 */
const listMyPosts = asyncHandler(async (req, res) => {
  const filter = { author: req.user._id };
  const status = normalizeText(req.query.status);

  if (status) {
    assertStatus(status);
    filter.status = status;
  }

  const search = normalizeText(req.query.search || req.query.q);
  if (search) {
    filter.title = { $regex: escapeRegExp(search), $options: 'i' };
  }

  const posts = await Post.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .populate(POST_POPULATE);

  res.json({ posts, total: posts.length });
});

/**
 * GET /api/posts/id/:id
 * Protected. Used by the editor to load a post, including drafts.
 * Only the author may read their own drafts.
 */
const getPostById = asyncHandler(async (req, res) => {
  const post = await findOwnedPost(req.params.id, req.user._id);
  await post.populate(POST_POPULATE);

  res.json({ post });
});

/**
 * GET /api/posts/:slug
 * Public. Published posts only — drafts are hidden behind a 404.
 */
const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await Post.findOne({
    slug: String(req.params.slug).toLowerCase(),
    status: 'published',
  }).populate(POST_POPULATE);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  res.json({ post });
});

/**
 * PUT /api/posts/:id
 * Protected (owner). Supports partial updates.
 */
const updatePost = asyncHandler(async (req, res) => {
  const post = await findOwnedPost(req.params.id, req.user._id);
  const body = req.body || {};
  let changed = false;

  if (body.title !== undefined) {
    const title = normalizeText(body.title);
    if (!title) throw new ApiError(400, 'Title is required');

    if (title !== post.title) {
      post.title = title;
      post.slug = await generateUniqueSlug(title, post._id);
    }
    changed = true;
  }

  if (body.content !== undefined) {
    const content = normalizeText(body.content);
    if (!content) throw new ApiError(400, 'Content is required');

    post.content = content;
    post.excerpt = buildExcerpt(content);
    changed = true;
  }

  if (body.coverImage !== undefined) {
    post.coverImage = normalizeText(body.coverImage);
    changed = true;
  }

  if (body.status !== undefined) {
    assertStatus(body.status);
    post.status = body.status;
    changed = true;
  }

  if (body.tags !== undefined) {
    post.tags = await resolveTags(body.tags);
    changed = true;
  }

  if (!changed) {
    throw new ApiError(400, 'No valid fields to update');
  }

  await post.save();
  await post.populate(POST_POPULATE);

  res.json({
    message: 'Post updated successfully',
    post,
  });
});

/**
 * DELETE /api/posts/:id
 * Protected (owner).
 */
const deletePost = asyncHandler(async (req, res) => {
  const post = await findOwnedPost(req.params.id, req.user._id);
  const postId = post._id.toString();

  await post.deleteOne();

  res.json({
    message: 'Post deleted successfully',
    id: postId,
  });
});

module.exports = {
  createPost,
  listPosts,
  listMyPosts,
  getPostById,
  getPostBySlug,
  updatePost,
  deletePost,
};
