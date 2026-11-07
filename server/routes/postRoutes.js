const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createPost,
  listPosts,
  listMyPosts,
  getPostById,
  getPostBySlug,
  updatePost,
  deletePost,
} = require('../controllers/postController');

const router = express.Router();

// Static/specific paths must be registered before the :slug route.
router.get('/mine', protect, listMyPosts);
router.get('/id/:id', protect, getPostById);

router.get('/', listPosts);
router.post('/', protect, createPost);

router.get('/:slug', getPostBySlug);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
