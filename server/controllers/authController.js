const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(400, 'An account with this email already exists');
  }

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password,
  });

  const token = generateToken(user);

  res.status(201).json({
    message: 'Account created successfully',
    token,
    user: user.toJSON(),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email: normalizeEmail(email) }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user);

  res.json({
    message: 'Logged in successfully',
    token,
    user: user.toJSON(),
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toJSON() });
});

module.exports = { register, login, getMe };
