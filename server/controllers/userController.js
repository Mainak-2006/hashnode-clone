const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { POST_POPULATE } = require('../utils/populate');
const { parsePagination, buildPagination } = require('../utils/pagination');

const PUBLIC_USER_FIELDS = 'name avatarUrl bio createdAt';

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const isValidUrl = (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * GET /api/users/:id
 * Public. A user's public profile and their published posts only.
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid user id');
  }

  const user = await User.findById(id).select(PUBLIC_USER_FIELDS);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { page, limit } = parsePagination(req.query);
  const filter = { author: user._id, status: 'published' };

  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate(POST_POPULATE);

  res.json({
    user: user.toJSON(),
    posts,
    pagination: buildPagination(page, limit, total),
  });
});

/**
 * PUT /api/users/me
 * Protected. Update the current user's profile fields.
 */
const updateMe = asyncHandler(async (req, res) => {
  const body = req.body || {};
  let changed = false;

  if (body.name !== undefined) {
    const name = normalizeText(body.name);
    if (name.length < 2) throw new ApiError(400, 'Name must be at least 2 characters');
    if (name.length > 60) throw new ApiError(400, 'Name cannot be longer than 60 characters');
    req.user.name = name;
    changed = true;
  }

  if (body.bio !== undefined) {
    const bio = normalizeText(body.bio);
    if (bio.length > 200) throw new ApiError(400, 'Bio cannot be longer than 200 characters');
    req.user.bio = bio;
    changed = true;
  }

  if (body.avatarUrl !== undefined) {
    const avatarUrl = normalizeText(body.avatarUrl);
    if (avatarUrl.length > 500) {
      throw new ApiError(400, 'Avatar URL cannot be longer than 500 characters');
    }
    if (!isValidUrl(avatarUrl)) {
      throw new ApiError(400, 'Avatar URL must be a valid http(s) URL');
    }
    req.user.avatarUrl = avatarUrl;
    changed = true;
  }

  if (!changed) {
    throw new ApiError(400, 'No valid fields to update');
  }

  await req.user.save();

  res.json({
    message: 'Profile updated successfully',
    user: req.user.toJSON(),
  });
});

module.exports = { getUserProfile, updateMe };
