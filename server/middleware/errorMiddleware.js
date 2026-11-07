const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, _req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Something went wrong';
  let details = error.details || null;

  // Malformed JSON body from express.json()
  if (error.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Request body must be valid JSON';
    details = null;
  }

  // Body larger than the configured limit
  if (error.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body is too large';
    details = null;
  }

  // Mongoose schema validation
  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    details = Object.values(error.errors).map((item) => item.message);
    message = details.join('. ');
  }

  // Invalid MongoDB ObjectId
  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid resource identifier';
  }

  // Duplicate unique key
  if (error.code === 11000) {
    statusCode = 400;
    const field = Object.keys(error.keyValue || error.keyPattern || {})[0] || 'field';
    message =
      field === 'email'
        ? 'An account with this email already exists'
        : `A record with this ${field} already exists`;
    details = null;
  }

  // JWT errors that were not caught in the middleware
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please log in again.';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    message,
    ...(details ? { errors: details } : {}),
    ...(process.env.NODE_ENV === 'development' && statusCode >= 500
      ? { stack: error.stack }
      : {}),
  });
};

module.exports = { notFound, errorHandler };
