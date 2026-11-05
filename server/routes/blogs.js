const express = require('express');
const router = express.Router();

// @route   GET api/blogs
// @desc    Get all blogs (public)
// @access  Public
router.get('/', (req, res) => {
  res.json({ message: 'Blogs route - will be implemented in later phases' });
});

// @route   POST api/blogs
// @desc    Create a new blog (protected)
// @access  Private
router.post('/', (req, res) => {
  res.status(401).json({ message: 'Protected route - auth required' });
});

module.exports = router;