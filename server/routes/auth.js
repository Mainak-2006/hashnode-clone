const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/me
// @desc    Get current user (protected)
// @access  Private (will add middleware later)
router.get('/me', (req, res) => {
  res.json({ message: 'Protected route - add auth middleware' });
});

module.exports = router;