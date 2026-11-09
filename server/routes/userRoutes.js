const express = require('express');
const { getUserProfile, updateMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   PUT /api/users/me
// @access  Private
router.put('/me', protect, updateMe);

// @route   GET /api/users/:id
// @access  Public
router.get('/:id', getUserProfile);

module.exports = router;
