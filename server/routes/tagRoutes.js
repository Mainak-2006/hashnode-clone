const express = require('express');
const { listTags, getTagPosts } = require('../controllers/tagController');

const router = express.Router();

router.get('/', listTags);
router.get('/:slug/posts', getTagPosts);

module.exports = router;
